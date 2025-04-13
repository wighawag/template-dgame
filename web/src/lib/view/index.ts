import { Camera } from '$lib/utils/render/camera';
import { WebGLRenderer } from '$lib/utils/render/WebGLRenderer';
import { writable } from 'svelte/store';

type ViewState = {};

export const camera = new Camera();
export const viewState = writable<ViewState>({});
export const renderer = new WebGLRenderer<ViewState>();
