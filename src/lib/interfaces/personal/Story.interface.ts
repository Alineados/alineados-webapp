import type { Documents, Generic, TypeEditable } from "../Generics.interface";

// DTOS
export interface StoryUpdate {
    pfid: string; // pillar info id
    cid: string; // category id
    banner: Documents;
    story_name: string;
    pillar_name: string;
    category_name: string;
    type: number; // 1 = testimony, 2 = conversatio
    involved: Generic[];
    experience: TypeEditable;
    life_sesson: TypeEditable;
    is_important: boolean;
}

export interface StoriesGrouped {
    testimony: Story[];
    conversation: Story[];
}

export interface StoryWithBanner {
    story: Story;
    banner_url: string;
}

export interface StoryDocumentWithUrl {
    document: Documents;
    url: string;
}


// MODELS

export interface Story {
    // ids
    id: string;
    uid: string;    // user id
    pfid: string;   // pillar info id
    cid: string;    // category id

    // properties
    banner: Documents;
    story_name: string;
    pillar_name: string;
    category_name: string;
    type: number;   // 1. testimony | 2. conversation
    involved: Generic[];
    experience: TypeEditable;
    life_sesson: TypeEditable;

    // secondary properties
    is_important: boolean;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
}