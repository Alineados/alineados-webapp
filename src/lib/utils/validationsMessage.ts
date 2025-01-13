import { ValidationType } from '$lib/interfaces/Validations.interface';

export const getValidationMessage = (type: ValidationType): string => {
	const messages: Record<ValidationType, string> = {
		[ValidationType.ALL_GOOD]: '',

		[ValidationType.REQUIRED]: 'campo requerido',

		[ValidationType.IS_TOO_SHORT]: 'demasiado corto',
		[ValidationType.IS_TOO_LONG]: 'máximo 20 carácteres',

		[ValidationType.INVALID_NAME]: 'solo se aceptan letras',
		[ValidationType.INVALID_EMAIL]: 'correo electrónico inválido',
		[ValidationType.REQUIRED_PHONE_CODE]: 'código de teléfono requerido',
		[ValidationType.INVALID_PHONE_NUMBER]: 'solo se aceptan números',
		[ValidationType.INVALID_USERNAME]: 'solo se aceptan letras o números',

		[ValidationType.USER_EXISTS]: 'el usuario ya existe',
		[ValidationType.EMAIL_EXISTS]: 'el correo electrónico ya existe',
		[ValidationType.PHONE_EXISTS]: 'el teléfono ya existe',

		[ValidationType.INVALID_CODE]: 'código inválido',

		[ValidationType.IS_CONTAINS_NAME_EMAIL]: 'no debe contener nombre o correo electrónico',
		[ValidationType.DONT_CONTAINS_SPECIAL_CHAR]: 'debe contener al menos un carácter especial',
		[ValidationType.PASSWORDS_DONT_MATCH]: 'las contraseñas no coinciden',

		[ValidationType.INVALID_CREDENTIALS]: 'credenciales inválidas'
	};
	return messages[type] || '';
};
