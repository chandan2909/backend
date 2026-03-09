import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import {
  getUserChats,
  createChat,
  addMessage,
  deleteChat,
  streamChatResponse
} from './chat.controller';

const router = Router();

// Retrieve all user chats and their messages
router.get('/', authenticate, getUserChats);

// Create a new chat session (optionally with an initial message)
router.post('/', authenticate, createChat);

// Append a message to an existing chat session
router.post('/:id/messages', authenticate, addMessage);

// Delete an entire chat session
router.delete('/:id', authenticate, deleteChat);

// Proxy streaming requests to Hugging Face
router.post('/stream', authenticate, streamChatResponse);

export default router;
