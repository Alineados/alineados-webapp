import type { DataPurpose } from '$lib/interfaces';

export class PurposesState {
	#purposes: DataPurpose[] = $state([]);

	init(purposes: DataPurpose[]) {
		this.#purposes = purposes;
	}

	// getters
	get purposes(): DataPurpose[] {
		return this.#purposes;
	}

	// methods
	addPurpose(purpose: DataPurpose) {
		this.#purposes = [...this.#purposes, purpose];
	}

	removePurpose(id: string) {
		this.#purposes = this.#purposes.filter((p) => p.id !== id);
	}

	updatePurpose(updatedPurpose: DataPurpose) {
		this.#purposes = this.#purposes.map((p) => (p.id === updatedPurpose.id ? updatedPurpose : p));
	}

	getPurposeById(id: string): DataPurpose | undefined {
		return this.#purposes.find((p) => p.id === id);
	}

	getPurposeByName(name: string): DataPurpose | undefined {
		return this.#purposes.find((p) => p.name === name);
	}
}

export const purposesState = new PurposesState();
