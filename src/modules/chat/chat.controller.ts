import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ChatRepository } from './chat.repository';

export const getUserChats = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const chats = await ChatRepository.getChatsForUser(Number(user.id));

  const chatsWithMessages = await Promise.all(
    chats.map(async (chat) => {
      const messages = await ChatRepository.getMessagesForChat(chat.id, Number(user.id));
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
  if (!user?.id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const { id, title, createdAt, initialMessage } = req.body;

  await ChatRepository.createChat(id, Number(user.id), title, createdAt);

  if (initialMessage) {
    await ChatRepository.addMessage(id, Number(user.id), initialMessage.role, initialMessage.content, createdAt);
  }

  res.status(201).json({ message: 'Chat created successfully' });
});

export const addMessage = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const chatId = req.params.id as string;
  const { role, content, createdAt, title } = req.body;

  await ChatRepository.addMessage(chatId, Number(user.id), role, content, createdAt);

  if (title) {
    await ChatRepository.updateChatTitle(chatId, Number(user.id), title, createdAt);
  }

  res.status(201).json({ message: 'Message added successfully' });
});

export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const chatId = req.params.id as string;
  await ChatRepository.deleteChat(chatId, Number(user.id));
  res.json({ message: 'Chat deleted successfully' });
});
