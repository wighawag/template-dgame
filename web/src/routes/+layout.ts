import { serviceWorker } from '$lib/core/config';
import { onDocumentLoaded } from '$lib/core/utils/web/hooks.js';
import { get } from 'svelte/store';

export const prerender = true;
export const trailingSlash = 'always';
export const ssr = true;

onDocumentLoaded(serviceWorker.register);

(globalThis as any).get = get;
