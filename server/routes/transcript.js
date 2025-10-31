import express from 'express';
import { getConversationHistory, getConversationBySession } from '../database/db.js';

const router = express.Router();

// Get transcript by session ID
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await getConversationBySession(sessionId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await getConversationHistory(conversation.ConversationID);

    res.json({
      conversationId: conversation.ConversationID,
      sessionId: conversation.SessionID,
      startTime: conversation.StartTime,
      messages: messages.map((msg) => ({
        role: msg.Role,
        content: msg.Content,
        timestamp: msg.Timestamp,
      })),
    });
  } catch (error) {
    console.error('Transcript error:', error);
    res.status(500).json({ error: 'Failed to get transcript' });
  }
});

export default router;
