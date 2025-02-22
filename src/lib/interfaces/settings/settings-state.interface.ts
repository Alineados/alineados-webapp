
export type InputField = {
	label: string
	name: string
	value: string
}

export type DescriptionField = {
	label: string
	description: string
	checked: boolean
}

interface Notification {
	label: string;
	description: string;
	checked: boolean;
}

interface InfoField {
	label: string;
	name: string;
	value: string;
}

export interface Settings {
	name: string;
	password: string;
	theme: string;
	language: string;
	pin: string;
	notification: Notification[];
	infoFields: InfoField[];
}
