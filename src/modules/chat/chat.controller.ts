r import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ChatRepository } from './chat.repository';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const getUserChats = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const chats = await ChatRepository.getChatsForUser(Number(user.userId));

  const chatsWithMessages = await Promise.all(
    chats.map(async (chat) => {
      const messages = await ChatRepository.getMessagesForChat(chat.id, Number(user.userId));
      return {
        id: chat.id,
        title: chat.title,
        createdAt: chat.created_at,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      };
    })
  );

  res.json(chatsWithMessages);
});

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const { id, title, createdAt, initialMessage } = req.body;

  await ChatRepository.createChat(id, Number(user.userId), title, createdAt);

  if (initialMessage) {
    await ChatRepository.addMessage(id, Number(user.userId), initialMessage.role, initialMessage.content, createdAt);
  }

  res.status(201).json({ message: 'Chat created successfully' });
});

export const addMessage = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const chatId = req.params.id as string;
  const { role, content, createdAt, title } = req.body;

  await ChatRepository.addMessage(chatId, Number(user.userId), role, content, createdAt);

  if (title) {
    await ChatRepository.updateChatTitle(chatId, Number(user.userId), title, createdAt);
  }

  res.status(201).json({ message: 'Message added successfully' });
});

export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const chatId = req.params.id as string;
  await ChatRepository.deleteChat(chatId, Number(user.userId));
  res.json({ message: 'Chat deleted successfully' });
});

export const streamChatResponse = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { message, history } = req.body;

  const messages = [{ role: 'system', content: 'You are Kodemy AI Assistant, a helpful learning assistant. Provide clear and concise answers.' }];
  if (history && Array.isArray(history)) {
    messages.push(...history.map((m: any) => ({ role: m.role, content: m.content })));
  }
  messages.push({ role: 'user', content: message });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY in environment variables.");
      return res.status(500).json({ error: "Server configuration error: missing AI provider key." });
    }

    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Ensure headers are sent immediately

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const formattedHistory = [];
    if (history && Array.isArray(history)) {
      const validHistory = history.filter(m => m.content && m.content.trim() !== '');
      
      let lastRole = '';
      for (const m of validHistory) {
        let role = m.role === 'user' ? 'user' : 'model';
        
        // Gemini requires strictly alternating user/model roles.
        // It must also start with 'user'.
        if (formattedHistory.length === 0 && role !== 'user') continue;
        if (role === lastRole) continue;
        
        formattedHistory.push({
          role,
          parts: [{ text: m.content }]
        });
        lastRole = role;
      }
    }

    console.log(`🚀 Starting Gemini stream for user ${user.userId}. History length: ${formattedHistory.length}`);

    const chat = model.startChat({
      history: formattedHistory,
      systemInstruction: {
        role: 'system',
        parts: [{ text: 'You are Kodemy AI Assistant, a helpful learning assistant. Provide clear and concise answers.' }]
      }
    });

    const result = await chat.sendMessageStream(message);

    let fullResponse = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      
      const payload = {
        choices: [{
          delta: {
            content: chunkText
          }
        }]
      };
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }
    
    console.log(`✅ Gemini stream complete. Response length: ${fullResponse.length}`);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error("Streaming error:", error);
    res.write(`data: ${JSON.stringify({ error: error?.message || "Failed to connect to AI" })}\n\n`);
    res.end();
  }
};

