import * as bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
export async function encodePassword(rawPass: string) {
    try {
        return bcrypt.hash(rawPass, salt);
    } catch (err) {
        console.log(err);
    }
}
export async function comparePassword(password: string, hashedPassword: string) {
    try {
        return bcrypt.compare(password, hashedPassword);
    } catch (err) {
        console.log(err);
    }
}
