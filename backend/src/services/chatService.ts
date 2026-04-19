import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import { CustomError } from '../middleware/errorHandler.js';
import env from '../config.js';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  suggestions: string[];
}

export class ChatService {
  private openai: OpenAI;
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  constructor() {
    if (!env.OPENAI_API_KEY) {
      logger.warn('OpenAI API key not configured, using fallback responses');
      this.openai = null as any;
    } else {
      this.openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });
    }
  }

  async processMessage(message: string, userId: string): Promise<ChatResponse> {
    try {
      // Get or initialize user chat history
      const history = this.chatHistory.get(userId) || [];
      
      // Add user message to history
      history.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      let response: string;
      let suggestions: string[] = [];

      if (this.openai) {
        // Use OpenAI API
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            ...history.slice(-10).map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        response = completion.choices[0]?.message?.content || this.getFallbackResponse(message);
        suggestions = this.generateSuggestions(message);
      } else {
        // Fallback responses
        response = this.getFallbackResponse(message);
        suggestions = this.generateSuggestions(message);
      }

      // Add assistant response to history
      history.push({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });

      // Keep only last 20 messages
      if (history.length > 20) {
        this.chatHistory.set(userId, history.slice(-20));
      } else {
        this.chatHistory.set(userId, history);
      }

      logger.info('Chat message processed', { userId, messageLength: message.length });

      return { message: response, suggestions };
    } catch (error) {
      logger.error('Error processing chat message', { error, userId });
      throw new CustomError('Failed to process message', 500);
    }
  }

  async getChatHistory(userId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    const history = this.chatHistory.get(userId) || [];
    return history.slice(offset, offset + limit);
  }

  async clearChatHistory(userId: string): Promise<void> {
    this.chatHistory.delete(userId);
    logger.info('Chat history cleared', { userId });
  }

  private getSystemPrompt(): string {
    return `You are Luxora, an AI assistant for the Luxora Environmental smart waste management platform. You help users with:

1. Recycling information and guidance
2. Sustainability advice and environmental tips
3. Platform navigation and feature explanations
4. Reward system questions and points information
5. Environmental education and awareness

Your tone should be:
- Friendly and encouraging
- Knowledgeable about environmental topics
- Passionate about sustainability
- Clear and concise
- Professional yet approachable

Always provide helpful, accurate information about recycling and environmental protection. If you don't know something, admit it and suggest where the user might find the information.

Keep responses under 300 words and be conversational.`;
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('recycl') || lowerMessage.includes('إعادة تدوير')) {
      return 'Recycling is essential for environmental protection! Start by separating your waste into categories: paper, plastic, metal, and organic. Our smart bins make it easy - just deposit your recyclables and earn points instantly!';
    }

    if (lowerMessage.includes('points') || lowerMessage.includes('نقاط')) {
      return 'You earn points by recycling in our smart bins! Each deposit gives you points based on the weight and type of material. Check your wallet to see your current balance and available rewards.';
    }

    if (lowerMessage.includes('reward') || lowerMessage.includes('مكافأة')) {
      return 'Rewards are our way of thanking you for recycling! You can exchange your points for discounts, gift cards, and other exciting offers. Visit the rewards section to see what\'s available.';
    }

    return 'Welcome to Luxora Environmental! I\'m here to help you with recycling, sustainability, and our platform features. How can I assist you today?';
  }

  private generateSuggestions(message: string): string[] {
    const suggestions = [
      'How do I start recycling?',
      'What rewards are available?',
      'Where are the nearest smart bins?',
      'How many points do I have?',
      'What materials can be recycled?',
    ];

    return suggestions.slice(0, 3);
  }
}
