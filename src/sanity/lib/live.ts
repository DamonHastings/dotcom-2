// Lightweight shim: some environments may not have `next-sanity/live`.
// Provide a minimal fallback that uses the existing `client.fetch` and
// a no-op `SanityLive` component so the project can build in environments
// where the optional package isn't installed.
import { client } from './client';

export const sanityFetch = async (query: string, params?: Record<string, unknown>) => {
  return client.fetch(query, params);
};

export const SanityLive = () => null;
