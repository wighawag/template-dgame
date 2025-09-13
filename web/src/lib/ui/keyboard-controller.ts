import type { EventEnitter } from '$lib/render/eventEmitter';
import { epochInfo, timeConfig } from '$lib/time';

interface KeyboardController {
	start: () => void;
	stop: () => void;
}

export function createKeyboardController(eventEmitter: EventEnitter): KeyboardController {
	// Store the event handler as a property so we can remove it later

	function onUp() {
		eventEmitter.emit('up');
	}
	function onDown() {
		eventEmitter.emit('down');
	}
	function onLeft() {
		eventEmitter.emit('left');
	}
	function onRight() {
		eventEmitter.emit('right');
	}

	function onSpace() {
		eventEmitter.emit('action');
	}

	function onBackspace() {
		eventEmitter.emit('backspace');
	}

	function keydownHandler(event: KeyboardEvent) {
		const $epochInfo = epochInfo.now();

		if (
			!$epochInfo.isCommitPhase ||
			$epochInfo.timeLeftInPhase < timeConfig.COMMIT_TIME_ALLOWANCE - 0.2
		) {
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

			case 'Backspace':
				onBackspace();
				break;
		}

		// console.log(event);
	}

	// The controller object to be returned
	const controller = {
		/**
		 * Start listening for keyboard eventEmitter
		 */
		start: function () {
			// Create the event handler function

			// Add the event listener
			document.addEventListener('keydown', keydownHandler);
		},

		/**
		 * Stop listening for keyboard eventEmitter
		 */
		stop: function () {
			document.removeEventListener('keydown', keydownHandler);
		}
	};

	return controller;
}
