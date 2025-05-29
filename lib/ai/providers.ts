import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai'; // OpenAI entegrasyonu burada!
import { isTestEnvironment } from '../constants'; // Kendi ortam değişkenini ayarladığını varsayıyorum.
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test'; // Test için local modeller

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        // OpenAI'nin GPT-4o modelini bağlıyoruz:
        'chat-model': openai('o4-mini'),
        // Reasoning (düşünme/analiz) için wrap ile middleware ekliyoruz:
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('o3'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        // Başlık ve artefakt için ayrı modeller kullanılabilir:
        'title-model': openai('o4-mini'),
        'artifact-model': openai('o4-mini'),
      },
      imageModels: {
        // OpenAI'nin DALL-E modeli için örnek:
        'small-model': openai.image('dall-e-3'),
      },
    });