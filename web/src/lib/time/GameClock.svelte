<script lang="ts">
	import { epochInfo, time, threePhase, twoPhase } from './index';

	// let percentage = $derived(
	// 	100 - Math.floor(($epochInfo.timeLeftInPhase * 100) / $epochInfo.currentPhaseDuration)
	// );

	// let color = $derived($epochInfo.isCommitPhase ? '#ff0000' : 'oklch(85.2% 0.199 91.936)');
	// let background = $derived($epochInfo.isCommitPhase ? '#00ff00' : '#ff0000');

	// let percentage = $derived(100 - Math.floor(($threePhase.timeLeft * 100) / $threePhase.duration));

	// let color = $derived(
	// 	$threePhase.phase == 'play'
	// 		? 'oklch(85.2% 0.199 91.936)'
	// 		: $threePhase.phase == 'commit'
	// 			? 'red'
	// 			: 'blue'
	// );
	// let background = $derived(
	// 	$threePhase.phase == 'play'
	// 		? '#00ff00'
	// 		: $threePhase.phase == 'commit'
	// 			? 'oklch(85.2% 0.199 91.936)'
	// 			: 'red'
	// );

	let percentage = $derived(100 - Math.floor(($twoPhase.timeLeft * 100) / $twoPhase.duration));

	let color = $derived($twoPhase.phase == 'play' ? 'red' : 'oklch(85.2% 0.199 91.936)');
	let background = $derived($twoPhase.phase == 'play' ? '#00ff00' : 'red');
</script>

<div
	class="progress"
	id="progress_wrapper"
	style={`--color: ${color}; --background: ${background}; --percentage: ${percentage}`}
>
	<progress id="progress" value="20" max="100"></progress>
</div>

<style>
	.progress {
		width: calc(var(--size, 100) * 1px);
		height: calc(var(--size, 100) * 1px);
		border-radius: 100%;
		overflow: hidden;
		padding: 0;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		color: transparent;
		background: transparent;
		float: left;
	}
	progress {
		height: 100%;
	}
	.progress:before {
		content: '';
		background: white;
		position: absolute;
		z-index: 100;
		/* parenthesis are required */
		width: calc((var(--size, 100) - (var(--width, 100) * 2)) * 1px);
		height: calc((var(--size, 100) - (var(--width, 100) * 2)) * 1px);
		border-radius: 50%;
		margin: auto auto;
	}
	progress::-moz-progress-value {
		background: transparent;
	}
	progress::-webkit-progress-value {
		background: transparent;
	}
	progress::-moz-progress-bar {
		background: transparent;
	}

	progress {
		background: conic-gradient(
			var(--color, red) 0% (var(--percentage, 33) * 1%),
			var(--background, yellow) (var(--percentage, 33) * 1%) 100%
		);
	}
	progress::-webkit-progress-bar {
		background: conic-gradient(
			var(--color, red) 0% calc(var(--percentage, 33) * 1%),
			var(--background, yellow) calc(var(--percentage, 33) * 1%) 100%
		);
	}
</style>
