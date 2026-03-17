import type { LayoutConfig } from '../services/layout.service';

export function isLayoutConfig(config: unknown): config is LayoutConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'mode' in config &&
    typeof config.mode === 'string' &&
    'sidebar' in config &&
    typeof config.sidebar === 'boolean' &&
    'auth' in config &&
    typeof config.auth === 'boolean'
  );
}
