import express from 'express';
import { generateResponse, getIntroduction } from '../services/claude.js';
import {
  createContact,
  createConversation,
  getConversationBySession,
  saveMessage,
  getConversationHistory,
  updateContactInfo,
} from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Session storage (in production, use Redis or similar)
const sessions = new Map();

// Initialize a new conversation
router.post('/init', async (req, res) => {
  try {
    const sessionId = uuidv4();
    const introduction = await getIntroduction();

    // Create session
    sessions.set(sessionId, {
      messages: [],
      contactInfo: { name: null, email: null, phone: null },
      conversationId: null,
      contactId: null,
    });

    res.json({
      sessionId,
      introduction,
    });
  } catch (error) {
    console.error('Init error:', error);
    res.status(500).json({ error: 'Failed to initialize conversation' });
  }
});

// Send a message
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Add user message to history
    session.messages.push({
      role: 'user',
      content: message,
    });

    // Check if message contains contact information
    await extractContactInfo(message, session);

    // Generate response from Claude
    const response = await generateResponse(session.messages, session.contactInfo);

    // Add assistant response to history
    session.messages.push({
      role: 'assistant',
      content: response.content,
    });

    // Save to database if we have a conversation ID
    if (session.conversationId) {
      await saveMessage(session.conversationId, 'user', message);
      await saveMessage(session.conversationId, 'assistant', response.content);
    } else if (session.contactInfo.name) {
      // Create conversation if we have at least a name
      await createConversationInDb(sessionId, session);
    }

    res.json({
      response: response.content,
      contactCollected: isContactComplete(session.contactInfo),
    });
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Save contact information
router.post('/contact', async (req, res) => {
  try {
    const { sessionId, name, email, phone } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update contact info
    if (name) session.contactInfo.name = name;
    if (email) session.contactInfo.email = email;
    if (phone) session.contactInfo.phone = phone;

    // Create or update contact in database
    if (!session.contactId && session.contactInfo.name) {
      await createConversationInDb(sessionId, session);
    } else if (session.contactId) {
      await updateContactInfo(session.contactId, email, phone);
    }

    res.json({
      success: true,
      contactInfo: session.contactInfo,
    });
  } catch (error) {
    console.error('Contact save error:', error);
    res.status(500).json({ error: 'Failed to save contact information' });
  }
});

// Get conversation history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      messages: session.messages,
      contactInfo: session.contactInfo,
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to get conversation history' });
  }
});

// Helper functions
async function createConversationInDb(sessionId, session) {
  try {
    if (!session.contactId) {
      // Create contact
      session.contactId = await createContact(
        session.contactInfo.name,
        session.contactInfo.email,
        session.contactInfo.phone
      );
    }

    if (!session.conversationId) {
      // Create conversation
      session.conversationId = await createConversation(session.contactId, sessionId);

      // Save all existing messages
      for (const msg of session.messages) {
        await saveMessage(session.conversationId, msg.role, msg.content);
      }
    }
  } catch (error) {
    console.error('Error creating conversation in DB:', error);
  }
}

function extractContactInfo(message, session) {
  // Simple email extraction
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch && !session.contactInfo.email) {
    session.contactInfo.email = emailMatch[0];
  }

  // Simple phone extraction (US format)
  const phoneMatch = message.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
  if (phoneMatch && !session.contactInfo.phone) {
    session.contactInfo.phone = phoneMatch[0];
  }

  return session.contactInfo;
}

function isContactComplete(contactInfo) {
  return !!(contactInfo.name && (contactInfo.email || contactInfo.phone));
}

export default router;
