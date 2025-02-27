import type { Thought } from '$lib/interfaces';

export class ThoughtsState {
	#thoughts: Array<Thought> = $state([]);

	#thoughtsCount: number = $state(0);

	#thoughtsFiltered: Array<Thought> = $state([]);

	#onlyImportant: boolean = $state(false);

	#importantCount: number = $state(0); // New state for important thoughts

	// init
	init(thoughts: Array<Thought>) {
		this.#thoughts = thoughts;
		this.#thoughtsCount = thoughts.length;
		this.#thoughtsFiltered = thoughts;
		this.#importantCount = thoughts.filter((thought) => thought.is_important).length;
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

	get onlyImportant(): boolean {
		return this.#onlyImportant;
	}

	get importantCount(): number {
		return this.#importantCount;
	}

	set onlyImportant(value: boolean) {
		this.#onlyImportant = value;
	}

	// methods
	filter(type: string, id: string = '') {
		// Case 1: No id filter - show all thoughts
		if (id === '') {
			this.#thoughtsFiltered = this.#onlyImportant
				? this.#thoughts.filter((thought) => thought.is_important)
				: this.#thoughts;
			return;
		}

		// Case 2: Filter by type and id
		if (this.#onlyImportant) {
			this.#thoughtsFiltered = this.#thoughts.filter(
				(thought) =>
					(type === 'pillar' ? thought.pfid === id : thought.ppid === id) && thought.is_important
			);
			return;
		}

		// Case 3: Filter only by type and id without important flag
		this.#thoughtsFiltered = this.#thoughts.filter((thought) =>
			type === 'pillar' ? thought.pfid === id : thought.ppid === id
		);
	}
}

export const thoughtsState = new ThoughtsState();
