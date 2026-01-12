import {get} from 'svelte/store';
import {onDocumentLoaded} from '$lib/utils/web/hooks.js';
import {serviceWorker} from '$lib/config';

export const prerender = true;
export const trailingSlash = 'always';
export const ssr = true;

onDocumentLoaded(serviceWorker.register);

(globalThis as any).get = get;
