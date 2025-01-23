import type { Phone, UserInfo } from "$lib/interfaces"

class UserState {
    #id?: string = $state("");
    #first_name: string = $state("");
    #last_name: string = $state("");
    #residence_country: string = $state("");
    #natal_country: string = $state("");
    #email: string = $state("");
    #birth_date: string = $state("");
    #phone_number: Phone= $state({country_code: "", number: ""});
    #whatsapp: Phone = $state({country_code: "", number: ""});
    #password: string = $state("");
    #username: string = $state("");
    #created_at: string = $state("");
    #updated_at?: string = $state("");
    #desactivated_at?: string = $state("");
    #verified: boolean = $state(false);

    init(user: UserInfo) {
        this.#id = user._id;
        this.#first_name = user.first_name;
        this.#last_name = user.last_name;
        this.#residence_country = user.residence_country;
        this.#natal_country = user.natal_country;
        this.#email = user.email;
        this.#birth_date = user.birth_date;
        this.#phone_number = user.phone_number;
        this.#whatsapp = user.whatsapp;
        this.#password = user.password;
        this.#username = user.username;
        this.#created_at = user.created_at;
        this.#updated_at = user.updated_at;
        this.#desactivated_at = user.desactivated_at;
        this.#verified = user.verified;
    }

    // getters

    get id(): string | undefined {
        return this.#id;
    }

    get first_name(): string {
        return this.#first_name;
    }

    get last_name(): string {
        return this.#last_name;
    }

    get residence_country(): string {
        return this.#residence_country;
    }

    get natal_country(): string {
        return this.#natal_country;
    }

    get email(): string {
        return this.#email;
    }

    get birth_date(): string {
        return this.#birth_date;
    }

    get phone_number(): Phone {
        return this.#phone_number;
    }

    get whatsapp(): Phone {
        return this.#whatsapp;
    }

    get password(): string {
        return this.#password;
    }

    get username(): string {
        return this.#username;
    }

    get created_at(): string {
        return this.#created_at;
    }

    get updated_at(): string | undefined {
        return this.#updated_at;
    }

    get desactivated_at(): string | undefined {
        return this.#desactivated_at;
    }

    get verified(): boolean {
        return this.#verified;
    }

}

export const userState = new UserState();