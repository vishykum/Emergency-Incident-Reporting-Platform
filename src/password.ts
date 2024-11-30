// TODO: password hashing here
import md5 from "md5";

/**
 * 
 * @param password 
 * @returns 
 */
export const hashPassword = (password:string): string => {
    return md5(password);
};

export const validatePassword = (inputPassword: string, password: string): boolean => {
    return md5(inputPassword) === password;
};