import type { Story } from "$lib/interfaces";

export class StoriesState {
    #testimonies: Array<Story> = $state([]);
    #conversations: Array<Story> = $state([]);

    #testimoniesCount: number = $state(0);
    #conversationsCount: number = $state(0);

    #testimoniesFiltered: Array<Story> = $state([]);
    #conversationsFiltered: Array<Story> = $state([]);

    #onlyImportant: boolean = $state(false);

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

    get onlyImportant(): boolean {
        return this.#onlyImportant;
    }

    set onlyImportant(value: boolean) {
        this.#onlyImportant = value
    }

    // methods

    filter(pfid: string, cid: string) {

        if (pfid === '' && cid === '') {
            if (this.#onlyImportant) {
                this.#testimoniesFiltered = this.#testimonies.filter((testimony) => testimony.is_important);
                this.#conversationsFiltered = this.#conversations.filter((conversation) => conversation.is_important);
                return;
            }
            this.#testimoniesFiltered = this.#testimonies;
            this.#conversationsFiltered = this.#conversations;
            return;
        }

        if (pfid !== '' && cid === '') {
            if (this.#onlyImportant) {
                this.#testimoniesFiltered = this.#testimonies.filter((testimony) => testimony.pfid === pfid && testimony.is_important);
                this.#conversationsFiltered = this.#conversations.filter((conversation) => conversation.pfid === pfid && conversation.is_important);
                return;
            }
            this.#testimoniesFiltered = this.#testimonies.filter((testimony) => testimony.pfid === pfid);
            this.#conversationsFiltered = this.#conversations.filter((conversation) => conversation.pfid === pfid);
            return;
        }

        if (this.#onlyImportant) {
            this.#testimoniesFiltered = this.#testimonies.filter((testimony) => testimony.pfid === pfid && testimony.cid === cid && testimony.is_important);
            this.#conversationsFiltered = this.#conversations.filter((conversation) => conversation.pfid === pfid && conversation.cid === cid && conversation.is_important);
            return;
        }

        this.#testimoniesFiltered = this.#testimonies.filter((testimony) => testimony.pfid === pfid && testimony.cid === cid);
        this.#conversationsFiltered = this.#conversations.filter((conversation) => conversation.pfid === pfid && conversation.cid === cid);
    }

    deleteTestimony(id: string) {
        this.#testimonies = this.#testimonies.filter((testimony) => testimony.id !== id);
        this.#testimoniesCount = this.#testimonies.length;
        this.#testimoniesFiltered = this.#testimonies;
    }

    deleteConversation(id: string) {
        this.#conversations = this.#conversations.filter((conversation) => conversation.id !== id);
        this.#conversationsCount = this.#conversations.length;
        this.#conversationsFiltered = this.#conversations;
    }

}

export const storiesState = new StoriesState();