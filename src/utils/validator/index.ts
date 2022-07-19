import validator from 'validator';

export const isValidEmail = (input: string) => validator.isEmail(input);

export const isValidPassword = (input: string) => /(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}/.test(input);

export const isValidTime = (input: string) => validator.isISO8601(input, { strict: true });
