import type { Story } from "$lib/interfaces";

export class StoriesState {
    #testimonies: Array<Story> = $state([]);
    #conversations: Array<Story> = $state([]);

    #testimoniesCount: number = $state(0);
    #conversationsCount: number = $state(0);

    #testimoniesFiltered: Array<Story> = $state([]);
    #conversationsFiltered: Array<Story> = $state([]);

    // init
    init(testimonies: Array<Story>, conversations: Array<Story>) {
        this.#testimonies = testimonies;
        this.#conversations = conversations;
        this.#testimoniesCount = testimonies.length;
        this.#conversationsCount = conversations.length;
        this.#testimoniesFiltered = testimonies;
        this.#conversationsFiltered = conversations;
    }


    // getters
    get testimonies(): Array<Story> {
        return this.#testimonies;
    }

    get conversations(): Array<Story> {
        return this.#conversations;
    }

    get testimoniesCount(): number {
        return this.#testimoniesCount;
    }

    get conversationsCount(): number {
        return this.#conversationsCount;
    }

    get testimoniesFiltered(): Array<Story> {
        return this.#testimoniesFiltered;
    }

    get conversationsFiltered(): Array<Story> {
        return this.#conversationsFiltered;
    }

    // methods


}

export const storiesState = new StoriesState();