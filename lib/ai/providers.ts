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
 * – Uses OpenAI Responses API (stateful) everywhere
 * – Enables Web Search tool for the dedicated model
 */
export const myProvider = isTestEnvironment
  ? customProvider({
      // Mock modeller (test ortamı)
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      // Prod modeller
      languageModels: {
        // Temel sohbet modeli
        'chat-model': openai.responses({ model: 'gpt-4o' }),

        // Açık “düşünce” middleware’li sürüm
        'chat-model-reasoning': wrapLanguageModel({
          model: openai.responses({ model: 'gpt-4o' }),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),

        // Başlık üreticisi
        'title-model': openai.responses({ model: 'gpt-4o' }),

        // Uzun içerik / artefact üreticisi
        'artifact-model': openai.responses({ model: 'gpt-4o' }),

        // Web Search etkin model
        'web-search-model': openai.responses({
          model: 'gpt-4o',
          web_search_options: {}, // boş obje → varsayılan aramayla etkin
        }),
      },

      // Görüntü modeli değişmedi
      imageModels: {
        'small-model': openai.image('gpt-image-1'),
      },
    });