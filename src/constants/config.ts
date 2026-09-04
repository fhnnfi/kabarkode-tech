/**
 * Config lingkungan. URL API TIDAK pernah di-hard-code di komponen (§51).
 */
import Constants from 'expo-constants';

function readEnv(name: string): string | undefined {
  const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
  if (fromProcess) return fromProcess;
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;
  return extra[name];
}

export const API_URL =
  readEnv('EXPO_PUBLIC_API_URL') ?? 'https://kabarkodeapi.fhanalabs.site/api/v1';

export const SITE_URL = readEnv('EXPO_PUBLIC_SITE_URL') ?? 'http://localhost:8090';

export const SITE_NAME = 'KabarKode';
export const SITE_TAGLINE = 'Kabar terbaru seputar dunia software engineering.';
