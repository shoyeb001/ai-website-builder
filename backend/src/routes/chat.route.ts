import express from 'express';
import chatController from '../controller/chat.controller';
const router = express.Router();

router
    .post('/chat',  chatController.getChat);

export default router;
