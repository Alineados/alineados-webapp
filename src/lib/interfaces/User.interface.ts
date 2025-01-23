export interface Phone {
    number: string;
    country_code: string;
}

export interface UserInfo {
    _id?: string;
    first_name: string;
    last_name: string;
    residence_country: string;
    natal_country: string;
    email: string;
    birth_date: string;
    phone_number: Phone;
    whatsapp: Phone;
    password: string;
    username: string;
    created_at: string;
    updated_at?: string;
    desactivated_at?: string;
    verified: boolean;
}
