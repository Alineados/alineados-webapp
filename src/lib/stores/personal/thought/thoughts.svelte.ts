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
        // First apply type/id filter
        let filtered = [...this.#thoughts];
        
        if (id) {
            filtered = filtered.filter(thought =>
                type === 'pillar' ? thought.pfid === id : thought.ppid === id
            );
        }

        // Then apply important filter if needed
        if (this.#onlyImportant) {
            filtered = filtered.filter(thought => thought.is_important);
        }

        this.#thoughtsFiltered = filtered;
    }

	deleteThought(id: string) {
		this.#thoughts = this.#thoughts.filter((thought) => thought.id !== id);
		this.#thoughtsCount = this.#thoughts.length;
		this.#thoughtsFiltered = this.#thoughts;
	}

	updateImportant(id: string, isImportant: boolean) {
		this.#thoughts = this.#thoughts.map((thought) =>
			thought.id === id ? { ...thought, is_important: isImportant } : thought
		);
		this.#thoughtsFiltered = this.#thoughtsFiltered.map((thought) =>
			thought.id === id ? { ...thought, is_important: isImportant } : thought
		);
		this.#importantCount = this.#thoughts.filter((t) => t.is_important).length;
	}
}

export const thoughtsState = new ThoughtsState();
