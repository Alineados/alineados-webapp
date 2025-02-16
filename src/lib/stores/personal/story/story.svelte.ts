import type { Categories, DataPillar, Documents, Generic, Story, TypeEditable } from "$lib/interfaces";
import { emptyGeneric } from "../../generic";

export class StoryState {
    // ids
    #id: string = $state(''); // story id
    #uid: string = $state(''); // user id
    #pfid: string = $state(''); // pillar id
    #cid: string = $state(''); // category id

    // properties
    #banner: Documents = $state({ id: '', name: '', url: '', content: '', type: '', created_at: '', file_name: '', path: '' });
    #bannerUrl: string = $state('');
    #story_name: string = $state('');
    #pillar_name: string = $state('');
    #category_name: string = $state('');
    #type: number = $state(0); // 1. testimony 2. conversation
    #involved: Generic[] = $state([]);
    #experience: TypeEditable = $state({ id: '', text: '', audio: null, documents: [] });
    #life_sesson: TypeEditable = $state({ id: '', text: '', audio: null, documents: [] });

    // secondary properties
    #is_important: boolean = $state(false);
    #created_at: string = $state('');
    #updated_at: string | null = $state(null);
    #deleted_at: string | null = $state(null);


    // methods
    init(story: Story, bannerUrl: string) {
        this.#id = story.id;
        this.#uid = story.uid;
        this.#pfid = story.pfid;
        this.#cid = story.cid;
        this.#banner = story.banner;
        this.#bannerUrl = bannerUrl;
        this.#story_name = story.story_name;
        this.#pillar_name = story.pillar_name;
        this.#category_name = story.category_name;
        this.#type = story.type;

        if (story.involved.length === 0)
            this.#involved = [{ ...emptyGeneric() }];
        else
            this.#involved = story.involved;

        this.#experience = story.experience;
        this.#life_sesson = story.life_sesson;
        this.#is_important = story.is_important;
        this.#created_at = story.created_at;
        this.#updated_at = story.updated_at ?? null;
        this.#deleted_at = story.deleted_at ?? null;
    }

    // getters
    get id(): string {
        return this.#id;
    }

    get uid(): string {
        return this.#uid;
    }

    get pfid(): string {
        return this.#pfid;
    }

    get cid(): string {
        return this.#cid;
    }

    get banner(): Documents {
        return this.#banner;
    }

    get bannerUrl(): string {
        return this.#bannerUrl;
    }

    get story_name(): string {
        return this.#story_name;
    }

    get pillar_name(): string {
        return this.#pillar_name;
    }

    get category_name(): string {
        return this.#category_name;
    }

    get type(): number {
        return this.#type;
    }

    get involved(): Generic[] {
        return this.#involved;
    }

    get experience(): TypeEditable {
        return this.#experience;
    }

    get experienceText(): string {
        return this.#experience.text ?? '';
    }

    get experienceAudioName(): string {
        return this.#experience.audio?.file_name ?? 'Subir audio';
    }

    get experienceAudio(): Documents {
        return this.#experience.audio ?? { id: '', content: '', type: '', created_at: '', file_name: 'Subir audio', path: '' };
    }

    get experienceDocuments(): Documents[] {
        return this.#experience.documents
    }

    get life_sesson(): TypeEditable {
        return this.#life_sesson;
    }

    get life_sessonText(): string {
        return this.#life_sesson.text ?? '';
    }

    get life_sessonAudio(): Documents {
        return this.#life_sesson.audio ?? { id: '', content: '', type: '', created_at: '', file_name: 'Subir audio', path: '' };
    }

    get life_sessonDocuments(): Documents[] {
        return this.#life_sesson.documents;
    }

    get is_important(): boolean {
        return this.#is_important;
    }

    get created_at(): string {
        return this.#created_at;
    }

    getJson(): Story {
        return {
            id: this.#id,
            uid: this.#uid,
            pfid: this.#pfid,
            cid: this.#cid,
            banner: this.#banner,
            story_name: this.#story_name,
            pillar_name: this.#pillar_name,
            category_name: this.#category_name,
            type: this.#type,
            involved: this.#involved,
            experience: this.#experience,
            life_sesson: this.#life_sesson,
            is_important: this.#is_important,
            created_at: this.#created_at
        }
    }

    // setters
    set id(value: string) {
        this.#id = value;
    }

    set uid(value: string) {
        this.#uid = value;
    }

    set pfid(value: string) {
        this.#pfid = value;
    }

    set cid(value: string) {
        this.#cid = value;
    }

    set banner(value: Documents) {
        this.#banner = value;
    }

    set story_name(value: string) {
        this.#story_name = value;
    }

    set pillar_name(value: string) {
        this.#pillar_name = value;
    }

    set category_name(value: string) {
        this.#category_name = value;
    }

    set type(value: number) {
        this.#type = value;
    }

    set experience(value: TypeEditable) {
        this.#experience = value;
    }

    set experienceText(value: string) {
        this.#experience.text = value;
    }

    set experienceAudio(value: Documents) {
        this.#experience.audio = value;

    }

    set life_sesson(value: TypeEditable) {
        this.#life_sesson = value;
    }

    set life_sessonText(value: string) {
        this.#life_sesson.text = value;
    }

    set life_sessonAudio(value: Documents) {
        this.#life_sesson.audio = value;
    }

    set is_important(value: boolean) {
        this.#is_important = value;
    }

    // Functions
    addinvolved(involved: Generic) {
        this.#involved = [...this.#involved, involved];
    }

    setType(typeStr: string) { // 'testimony' | 'conversation'
        this.#type = typeStr === 'testimony' ? 1 : 2;

    }

    setPillar(pillar: DataPillar) {
        this.#pfid = pillar.id;
        this.#pillar_name = pillar.label;
    }

    setCategory(category: Categories) {
        this.#cid = category.id;
        this.#category_name = category.label;
    }

    addInvolved(previous_id: string) {
        const index = this.#involved.findIndex(inv => inv.id === previous_id);
        this.#involved.splice(index + 1, 0, { ...emptyGeneric() });
    }

    removeOrClean(id: string) {
        const index = this.#involved.findIndex(inv => inv.id === id);
        if (this.#involved.length > 1)
            this.#involved.splice(index, 1);
        else
            this.#involved[index].description = '';
    }

    appendExperienceDocuments(docs: Documents[]) {

        if (this.#experience.documents)

            this.#experience.documents = [...this.#experience.documents, ...docs];
        else
            this.#experience.documents = docs;


    }

    appendLifeSessonDocuments(docs: Documents[]) {

        if (this.#life_sesson.documents)

            this.#life_sesson.documents = [...this.#life_sesson.documents, ...docs];
        else
            this.#life_sesson.documents = docs;
    }

}

export const storyState = new StoryState();