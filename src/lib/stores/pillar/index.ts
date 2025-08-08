import { writable } from 'svelte/store';
import { nanoid } from 'nanoid';

interface PillarItem {
    id: string;
    description: string;
    prominent: boolean;
    daily: boolean;
}

interface PillarState {
    elements: PillarItem[];
    objectives: PillarItem[];
    pastActions: PillarItem[];
    habits: PillarItem[];
}

const createPillarStore = () => {
    const initialState: PillarState = {
        elements: [{ id: nanoid(), description: '', prominent: false, daily: false }],
        objectives: [{ id: nanoid(), description: '', prominent: false, daily: false }],
        pastActions: [{ id: nanoid(), description: '', prominent: false, daily: false }],
        habits: [{ id: nanoid(), description: '', prominent: false, daily: false }]
    };

    const { subscribe, update } = writable(initialState);

    return {
        subscribe,
        addPillarItem: (id: string, type: keyof PillarState) => {
            update(state => {
                state[type] = [...state[type], { id: nanoid(), description: '', prominent: false, daily: false }];
                return state;
            });
        },
        removeOrCleanItem: (id: string, type: keyof PillarState) => {
            update(state => {
                state[type] = state[type].filter(item => item.id !== id);
                return state;
            });
        },
        prominentItem: (id: string, type: keyof PillarState) => {
            update(state => {
                const item = state[type].find(item => item.id === id);
                if (item) {
                    item.prominent = !item.prominent;
                }
                return state;
            });
        },
        markDailyItem: (id: string, type: keyof PillarState) => {
            update(state => {
                const item = state[type].find(item => item.id === id);
                if (item) {
                    item.daily = !item.daily;
                }
                return state;
            });
        }
    };
};

export const pillarStore = createPillarStore();

// Export professional autosave functionality from category store
export {
	currentCategoryInfo,
	isPillarSaving,
	currentCategoryActive,
	hasCategoryContent,
	updateCategoryStateBasedOnContent,
	autosaveStatus,
	lastSavedAt,
	saveImmediately,
	saveSynchronously,
	updateCategoryInfoAndSave
} from './category';