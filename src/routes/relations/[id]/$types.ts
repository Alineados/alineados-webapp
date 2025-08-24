import type { Area, Relation } from '$lib/interfaces/Relations.interface';

export interface PageData {
    relation: Relation;
    areas: Area[];
    uid: string;
}
