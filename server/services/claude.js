import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let knowledgeBase = null;

async function loadKnowledgeBase() {
  if (!knowledgeBase) {
    const knowledgePath = join(__dirname, '../../knowledge-base.json');
    const data = await readFile(knowledgePath, 'utf8');
    knowledgeBase = JSON.parse(data);
  }
  return knowledgeBase;
}

function buildSystemPrompt(knowledge) {
  return `You are ${knowledge.bot_name}, an AI-powered financial customer service assistant. ${knowledge.bot_personality}.

CRITICAL INSTRUCTIONS:
1. You can ONLY answer questions related to the knowledge base provided below.
2. If a question is outside the knowledge base, politely decline and use one of the fallback responses.
3. Be conversational, warm, and human-like in your responses.
4. Keep responses concise but informative.
5. If you haven't collected contact information yet, ask for it naturally during the conversation.
6. Always maintain a professional yet friendly tone.

KNOWLEDGE BASE:
${JSON.stringify(knowledge.categories, null, 2)}

FALLBACK RESPONSES (use when question is outside knowledge base):
${knowledge.fallback_responses.map((r, i) => `${i + 1}. ${r}`).join('\n')}

CONTACT COLLECTION:
- Initial prompt: "${knowledge.contact_collection.initial_prompt}"
- Name prompt: "${knowledge.contact_collection.name_prompt}"
- Email prompt: "${knowledge.contact_collection.email_prompt}"
- Phone prompt: "${knowledge.contact_collection.phone_prompt}"
- Confirmation: "${knowledge.contact_collection.confirmation}"

When collecting contact information, ask one question at a time and be natural about it.`;
}

export async function generateResponse(messages, contactInfo = null) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const knowledge = await loadKnowledgeBase();
    const systemPrompt = buildSystemPrompt(knowledge);

    // Add contact context if available
    let contextualSystemPrompt = systemPrompt;
    if (contactInfo) {
      contextualSystemPrompt += `\n\nCURRENT USER CONTACT INFO:\nName: ${contactInfo.name || 'Not provided'}\nEmail: ${contactInfo.email || 'Not provided'}\nPhone: ${contactInfo.phone || 'Not provided'}`;
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: contextualSystemPrompt,
      messages: messages,
    });

    return {
      content: response.content[0].text,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to generate response from Claude API');
  }
}

export async function getIntroduction() {
  const knowledge = await loadKnowledgeBase();
  return knowledge.introduction;
}

export { loadKnowledgeBase };
