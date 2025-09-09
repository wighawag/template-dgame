export function createEvents() {
	return {
		onClick(pos: { x: number; y: number }) {}
	};
}

export const events = createEvents();

export type Events = typeof events;
