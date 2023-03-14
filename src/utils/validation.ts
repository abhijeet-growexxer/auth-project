import { BadRequestException } from '@nestjs/common';
import { UserSignInModel, UserSignUpModel } from '../Models/UserModels';
import { Constants } from "./constants"

export function validateUserSignUp(userDetails: UserSignUpModel) {
    const { email, name, phone, password } = userDetails;
    if (!email || !Constants.EMAIL.test(email)) {
        throw new BadRequestException("Invalid Email Id")
    }
    if (!name || !Constants.NAME.test(name)) {
        throw new BadRequestException("Invalid name")
    }
    if (!password || !Constants.PASSWORD.test(password)) {
        throw new BadRequestException("Invalid password")
    }
    if (!phone || !Constants.PHONE.test(phone)) {
        throw new BadRequestException("Invalid phone number")
    }
    return true

}

export function validateUserSignIn(userDetails: UserSignInModel) {
    const { username, email, password } = userDetails
    if ((!username && !email) || (username && email)) {
        return new BadRequestException("Please provide username or email for sign in")
    }
    if (email && !Constants.EMAIL.test(email)) {
        return new BadRequestException("Invalid email")
    }
    if (!Constants.PASSWORD.test(password)) {
        return new BadRequestException("Invalid password")
    }
}
