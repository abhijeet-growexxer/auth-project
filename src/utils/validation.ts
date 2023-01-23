import { UserSignInModel, UserSignUpModel } from '../Models/UserModels';

export function validateUser(userDetails: UserSignUpModel | UserSignInModel) {
    const { email, password } = userDetails;
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPassword =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (regexEmail.exec(email) == null) {
        return false;
    }
    if (regexPassword.exec(password) == null) {
        return false;
    }
    return true;
}
