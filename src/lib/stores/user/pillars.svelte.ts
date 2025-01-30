import type { DataPillar, PillarsAndCategories } from "$lib/interfaces";

export class PillarState {

    #health: DataPillar = $state({id: '', name: '', label: '', categories: []})
    #relational: DataPillar = $state({id: '', name: '', label: '', categories: []})
    #vocational: DataPillar = $state({id: '', name: '', label: '', categories: []})
    #spiritual: DataPillar = $state({id: '', name: '', label: '', categories: []})

    init(pillars: PillarsAndCategories) {
        this.#health = pillars.health;
        this.#relational = pillars.relational;
        this.#vocational = pillars.vocational;
        this.#spiritual = pillars.spiritual;
    }

    // getters
    get health(): DataPillar {
        return this.#health;
    }

    get relational(): DataPillar {
        return this.#relational;
    }

    get vocational(): DataPillar {
        return this.#vocational;
    }

    get spiritual(): DataPillar {
        return this.#spiritual;
    }
}

export const pillarState = new PillarState();