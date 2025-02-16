import type { Thought } from '$lib/interfaces';

export class ThoughtsState {
	#thoughts: Array<Thought> = $state([]);

	#thoughtsCount: number = $state(0);

	#thoughtsFiltered: Array<Thought> = $state([]);

	// init
	init(thoughts: Array<Thought>) {
		this.#thoughts = thoughts;
		this.#thoughtsCount = thoughts.length;
		this.#thoughtsFiltered = thoughts;
	}

	// getters
	get thoughts(): Array<Thought> {
		return this.#thoughts;
	}

	get thoughtsCount(): number {
		return this.#thoughtsCount;
	}

	get thoughtsFiltered(): Array<Thought> {
		return this.#thoughtsFiltered;
	}
}

export const thoughtsState = new ThoughtsState();
