
import type { Settings, DescriptionField, InputField } from "$lib/interfaces/settings/settings-state.interface"

const defaultNotifications = [
	{
		label: 'SMS',
		description: "Activa notificaiones SMS",
		checked: false

	},
	{
		label: 'Whatsapp',
		description: "Activa notificaiones Whatsapp",
		checked: false

	},
	{
		label: 'Email',
		description: "Activa notificaiones Email",
		checked: false

	},
]

const defaultInfoFields = [

	{
		label: 'email',
		name: 'correo',
		value: ''
	},
	{
		label: 'Numero de telefono',
		name: 'phone',
		value: ''
	},
	{
		label: 'Numero de whatsapp',
		name: 'wphone',
		value: ''
	},
	{
		label: 'Cumpleaños',
		name: 'birthday',
		value: ''
	},
	{
		label: 'Pais de nacimiento',
		name: 'birthplace',
		value: ''
	},
	{
		label: 'Pais de recidencia',
		name: 'country',
		value: ''
	},
]

class InfoSate {
	#infoStr: string = $derived.by(() => {
		return JSON.stringify({
			name: this.#name,
			password: this.#password,
			theme: this.#theme,
			language: this.#language,
			pin: this.#pin,
			notification: this.#notification,
			infoFields: this.#infoFields
		})
	})

	#starting: boolean = $state(false)
	#name: string = $state("")
	#password: string = $state("")
	#theme: string = $state("claro")
	#language: string = $state("spanish")
	#pin: string = $state("")
	#notification: DescriptionField[] = $state(defaultNotifications)
	#infoFields: InputField[] = $state(defaultInfoFields)

	init(settings: Settings) {
		if (settings.name) {
			this.name = settings?.name
		}
		if (settings.notification) {
			this.notification = settings?.notification;
		}
		if (settings.language) {
			this.language = settings?.language;
		}
		if (settings.theme) {
			this.theme = settings.theme;
		}
		if (settings.password) {
			this.password = settings.password;
		}
		if (settings.pin) {
			this.pin = settings.pin;
		}

		if (settings.infoFields) {
			console.log(settings.infoFields)
			this.#infoFields = settings.infoFields
		}
		this.#starting = true
	}

	get starting(): boolean {
		return this.#starting
	}

	set starting(value: boolean) {
		this.#starting = value
	}

	get infoStr(): string {
		return this.#infoStr
	}

	get pin(): string {
		return this.#pin
	}

	set pin(value: string) {
		this.#pin = value

	}

	get language(): string {
		return this.#language
	}

	set language(value: string) {
		this.#language = value
	}

	get theme(): string {
		return this.#theme
	}

	set theme(value: string) {
		this.#theme = value
	}

	get notification(): DescriptionField[] {
		return this.#notification
	}

	set notification(value: DescriptionField[]) {
		this.#notification = value
	}


	get infoFields(): InputField[] {
		return this.#infoFields
	}

	set infoFields(value: InputField[]) {
		this.infoFields = value
	}

	get password(): string {
		return this.#password
	}

	set password(value: string) {
		this.#password = value
	}
	get name(): string {
		return this.#name
	}

	set name(value: string) {
		this.#name = value
	}

}

export const infoState = new InfoSate()
