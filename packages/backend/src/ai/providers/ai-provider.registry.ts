import type { IAiProvider } from './ai-provider.interface.js';
import { OllamaProvider } from './ollama.provider.js';

export const AI_PROVIDERS: IAiProvider[] = [new OllamaProvider()];

export const AI_PROVIDER_IDS: string[] = AI_PROVIDERS.map((p) => p.meta.id);

export function findProvider(id: string): IAiProvider | undefined {
  return AI_PROVIDERS.find((p) => p.meta.id === id);
}
