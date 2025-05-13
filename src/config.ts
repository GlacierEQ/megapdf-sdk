import { MegaPdfConfig } from './types';

/**
 * Default configuration values for the MegaPDF client
 */
export const DEFAULT_CONFIG: Omit<MegaPdfConfig, 'apiKey'> = {
  baseUrl: 'https://api.mega-pdf.com',
  timeout: 60000,
  https: true,
  retryOnFailure: true,
  maxRetries: 3
};

/**
 * Merge user configuration with default configuration
 * 
 * @param userConfig User-provided configuration
 * @returns Merged configuration
 */
export function mergeConfig(userConfig: MegaPdfConfig): MegaPdfConfig {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig
  };
}