import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ChatRepository } from './chat.repository';

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
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Ensure headers are sent immediately

    const hfResponse = await fetch("https://spoidermon29-lms-ai-assistant.hf.space/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!hfResponse.ok) {
      throw new Error(`AI Server Error: ${hfResponse.status}`);
    }

    if (hfResponse.body) {
      const reader = hfResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    res.write(`data: ${JSON.stringify({ error: "Failed to connect to AI" })}\n\n`);
    res.end();
  }
};

