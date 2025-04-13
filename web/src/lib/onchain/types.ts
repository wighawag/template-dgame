export type Character = {
	id: string;
	position: { x: number; y: number };
};
export type OnchainState = {
	[id: string]: Character;
};
