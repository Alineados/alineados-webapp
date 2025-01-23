// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PillarsAndCategories, UserInfo } from "$lib/interfaces";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token: string;
			user: UserInfo;
			pillars: PillarsAndCategories;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
