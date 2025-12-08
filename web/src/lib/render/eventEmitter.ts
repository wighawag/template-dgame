import { EventEmitter } from 'tseep/lib/ee-safe';

export const eventEmitter = new EventEmitter<{
	clicked: (pos: { x: number; y: number }) => void;
}>();

export type MyEventEmitter = typeof eventEmitter;
