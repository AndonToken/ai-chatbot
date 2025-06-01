import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

/**
 * Provider configuration
 * – Uses OpenAI Responses API for all language models
 * – Enables on-demand Web Search via `web_search_options`
 */
export const myProvider = isTestEnvironment
  ? customProvider({
      // Mock models for unit/integration tests
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      // Production models
      languageModels: {
        // Base conversational model (Responses API)
        'chat-model': openai.responses('gpt-4o'),

        // Same model wrapped with explicit reasoning capture
        'chat-model-reasoning': wrapLanguageModel({
          model: openai.responses('gpt-4o'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),

        // Short title generator
        'title-model': openai.responses('gpt-4o'),

        // Rich artefact / content generator
        'artifact-model': openai.responses('gpt-4o'),

        // Model with Web Search tool enabled (invoked only when the model decides)
        'web-search-model': openai.responses('gpt-4o', {
          // Empty object → enable Web Search with default behaviour
          web_search_options: {},
        }),
      },

      // Image generation models
      imageModels: {
        'small-model': openai.image('gpt-image-1'),
      },
    });