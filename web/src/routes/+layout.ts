import { get } from 'svelte/store';
import '../app.css';
export const prerender = true;
export const trailingSlash = 'always';

(globalThis as any).get = get;
