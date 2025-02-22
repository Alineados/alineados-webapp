import type { DataPillar, DataPurpose, Documents, Thought, TypeEditable } from '$lib/interfaces';

export class ThoughtState {
	// ids
	#id: string = $state(''); // thought id
	#uid: string = $state(''); // user id
	#pfid: string = $state(''); // pillar id
	#ppid: string = $state(''); // purpose  id

	// propertiess
	#thought_name: string = $state('');
	#pillar_name: string = $state('');
	#purpose_name: string = $state('');
	#quality_time: TypeEditable = $state({ id: '', text: '', audio: null, documents: [] });

	// secondary properties
	#is_important: boolean = $state(false);
	#created_at: string = $state('');
	#updated_at: string | null = $state(null);
	#deleted_at: string | null = $state(null);

	// methods
	init(thought: Thought) {
		this.#id = thought.id;
		this.#uid = thought.uid;
		this.#pfid = thought.pfid;
		this.#ppid = thought.ppid;
		this.#thought_name = thought.thought_name;
		this.#pillar_name = thought.pillar_name;
		this.#purpose_name = thought.purpose_name;

		this.#quality_time = thought.quality_time;
		this.#is_important = thought.is_important;
		this.#created_at = thought.created_at;
		this.#updated_at = thought.updated_at ?? null;
		this.#deleted_at = thought.deleted_at ?? null;
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

	get ppid(): string {
		return this.#ppid;
	}

	get thought_name(): string {
		return this.#thought_name;
	}

	get pillar_name(): string {
		return this.#pillar_name;
	}

	get purpose_name(): string {
		return this.#purpose_name;
	}

	get quality_time(): TypeEditable {
		return this.#quality_time;
	}

	get quality_timeText(): string {
		return this.#quality_time.text ?? '';
	}

	get quality_timeAudioName(): string {
		return this.#quality_time.audio?.file_name ?? 'Subir audio';
	}

	get quality_timeAudio(): Documents {
		return (
			this.#quality_time.audio ?? {
				id: '',
				content: '',
				type: '',
				created_at: '',
				file_name: 'Subir audio',
				path: ''
			}
		);
	}

	get quality_timeDocuments(): Documents[] {
		return this.#quality_time.documents;
	}

	get is_important(): boolean {
		return this.#is_important;
	}

	get created_at(): string {
		return this.#created_at;
	}

	getJson(): Thought {
		return {
			id: this.#id,
			uid: this.#uid,
			pfid: this.#pfid,
			ppid: this.#ppid,
			thought_name: this.#thought_name,
			pillar_name: this.#pillar_name,
			purpose_name: this.#purpose_name,
			quality_time: this.#quality_time,
			is_important: this.#is_important,
			created_at: this.#created_at
		};
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

	set ppid(value: string) {
		this.#ppid = value;
	}

	set thought_name(value: string) {
		this.#thought_name = value;
	}

	set pillar_name(value: string) {
		this.#pillar_name = value;
	}

	set purpose_name(value: string) {
		this.#purpose_name = value;
	}

	set quality_time(value: TypeEditable) {
		this.#quality_time = value;
	}

	set quality_timeText(value: string) {
		this.#quality_time.text = value;
	}

	set quality_timeAudio(value: Documents) {
		this.#quality_time.audio = value;
	}

	set is_important(value: boolean) {
		this.#is_important = value;
	}

	// Functions
	setPillar(pillar: DataPillar) {
		this.#pfid = pillar.id;
		this.#pillar_name = pillar.label;
	}

	setPurpose(purpose: DataPurpose) {
		this.#ppid = purpose.id;
		this.#purpose_name = purpose.label;
	}

	appendQualityTimeDocuments(docs: Documents[]) {
		if (this.#quality_time.documents)
			this.#quality_time.documents = [...this.#quality_time.documents, ...docs];
		else this.#quality_time.documents = docs;
	}
}

export const thoughtState = new ThoughtState();
