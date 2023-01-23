import * as CryptoJS from 'crypto-js';

export function encryptData(text: string) {
    return CryptoJS.AES.encrypt(text, 'secret key').toString();
}

export function compareTokens(token: string, cipherToken: string) {
    const bytes = CryptoJS.AES.decrypt(cipherToken, 'secret key').toString(CryptoJS.enc.Utf8);
    return token === bytes
}
