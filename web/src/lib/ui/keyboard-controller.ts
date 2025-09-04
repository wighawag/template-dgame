import { epochInfo } from '$lib/time';
import { localState } from '$lib/view/localState.js';

interface KeyboardController {
	start: () => void;
	stop: () => void;
}

export function createKeyboardController(): KeyboardController {
	// Store the event handler as a property so we can remove it later

	function onUp() {
		localState.move(0, -1);
	}
	function onDown() {
		localState.move(0, 1);
	}
	function onLeft() {
		localState.move(-1, 0);
	}
	function onRight() {
		localState.move(1, 0);
	}

	function onSpace() {
		localState.placeBomb();
	}

	function keydownHandler(event: KeyboardEvent) {
		const $epochInfo = epochInfo.now();

		if (!$epochInfo.isCommitPhase || $epochInfo.timeLeftInPhase < 3.1) {
			return;
		}
		switch (event.key) {
			// Arrow keys
			case 'ArrowUp':
				onUp();
				break;
			case 'ArrowDown':
				onDown();
				break;
			case 'ArrowLeft':
				onLeft();
				break;
			case 'ArrowRight':
				onRight();
				break;

			// WASD keys
			case 'w':
			case 'W':
				onUp();
				break;
			case 's':
			case 'S':
				onDown();
				break;
			case 'a':
			case 'A':
				onLeft();
				break;
			case 'd':
			case 'D':
				onRight();
				break;

			case ' ':
				onSpace();
				break;
		}
	}

	// The controller object to be returned
	const controller = {
		/**
		 * Start listening for keyboard events
		 */
		start: function () {
			// Create the event handler function

			// Add the event listener
			document.addEventListener('keydown', keydownHandler);
		},

		/**
		 * Stop listening for keyboard events
		 */
		stop: function () {
			document.removeEventListener('keydown', keydownHandler);
		}
	};

	return controller;
}

export const keyboardController = createKeyboardController();
