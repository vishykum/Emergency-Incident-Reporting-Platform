// TODO: password hashing here
import md5 from "md5";

export const validatePassword = (inputPassword: string, password: string): boolean => {
    return md5(inputPassword) === password;
};