import type { IAiProvider } from './ai-provider.interface.js';
import { OllamaProvider } from './ollama.provider.js';
import { OpenRouterProvider } from './open-router.provider.js';

export const AI_PROVIDERS: IAiProvider[] = [new OllamaProvider(), new OpenRouterProvider()];

export const AI_PROVIDER_IDS: string[] = AI_PROVIDERS.map((p) => p.meta.id);

export function findProvider(id: string): IAiProvider | undefined {
  return AI_PROVIDERS.find((p) => p.meta.id === id);
}
