import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/User.schema';
import { UserSignInModel, UserSignUpModel } from '../Models/UserModels';
import { validateUserSignIn, validateUserSignUp } from '../utils/validation';
import { encodePassword, comparePassword } from 'src/utils/bcrypt';
import { TokenService } from './TokenService';
import { encryptData, compareTokens } from '../utils/crypto';
import * as otpGenerator from 'otp-generator';
import { sendEmail } from '../utils/sendEmail';
import * as gravatar from "gravatar";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private tokenService: TokenService
    ) { }

    //register a mew user
    async signUp(userDetails: UserSignUpModel) {
        validateUserSignUp(userDetails)
        const { username, phone, name, email, password } = userDetails;

        const userEmailExists = await this.userModel.findOne({ email });
        const usernameExists = await this.userModel.findOne({ username });

        if (userEmailExists || usernameExists) {
            return new ConflictException('user with same email or username already exists');
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        const hashPassword = await encodePassword(password);
        const verificationOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
        const newUser = new this.userModel({ username, phone, name, email, avatar, password: hashPassword, verificationOTP, role: 1 });
        await newUser.save();
        sendEmail(email, "Email Verification", `Enter the code to verify your email address: ${verificationOTP}`);
        return this.updateRefreshToken(newUser._id.toString(), newUser.name);
    }

    //SignIn Services
    async signIn(userDetails: UserSignInModel) {
        validateUserSignIn(userDetails)
        const { username, email, password } = userDetails;
        let userExists = null
        if (username) {
            userExists = await this.userModel.findOne({ username });
        }
        else if (email) {
            userExists = await this.userModel.findOne({ email });
        }

        if (!userExists) {
            throw new BadRequestException('Invalid credentials');
        }

        const hashedPassword = userExists.password;
        const checkPassword = await comparePassword(password, hashedPassword);
        if (!checkPassword) {
            throw new BadRequestException('Invalid user credentials');
        }

        return this.updateRefreshToken(userExists._id.toString(), userExists.name)
    }

    // nullifies current logged in user's refresh token and logs out
    async logout(userId: string) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
        return 'Logged Out';
    }

    //replace current logged in user's refresh token
    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userModel.findById(userId);
        if (!user || !refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        const { refreshToken: userRefreshToken } = user;
        const compareRefreshToken = await compareTokens(refreshToken, userRefreshToken);
        if (!compareRefreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        return this.updateRefreshToken(userId, user.name)

    }

    //verify OTP
    async verifyOTP(userId: string, otp: string) {
        const user = await this.userModel.findById(userId);
        if (!user || !otp) {
            throw new ForbiddenException('invalid OTP');
        }
        if (user.verificationOTP != otp) {
            throw new ForbiddenException('Invalid OTP');
        }
        await this.userModel.findByIdAndUpdate(userId, { verificationOTP: null, verified: true }, { new: true })
        return "verified account"
    }

    // forgot-password
    async forgotPassword(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new BadRequestException('Email not registered');
        }
        const verificationOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
        await this.userModel.findByIdAndUpdate(user.id, { verificationOTP, verified: false }, { new: true });
        sendEmail(email, 'Reset Password verification', `Enter the verification OTP to reset the password 
        OTP: ${verificationOTP}`);

        return "verify the otp sent to your account";
    }

    async confirmOTP(email: string, otp: string) {
        const user = await this.userModel.findOne({ email });
        if (!user || !otp) {
            throw new ForbiddenException('Invalid user');
        }
        if (user.verificationOTP != otp) {
            throw new ForbiddenException('Invalid OTP');
        }
        const tokens = await this.tokenService.getTokens(user.id, user.name);
        const hashedRefreshToken = await encryptData(tokens.refreshToken)
        await this.userModel.findByIdAndUpdate(user.id, { refreshToken: hashedRefreshToken, verificationOTP: null, verified: true }, { new: true });
        return tokens;
    }

    async updatePassword(userId: string, password: string) {
        console.log(userId)
        const hashedPassword = await encodePassword(password);
        await this.userModel.findByIdAndUpdate({ _id: userId }, { password: hashedPassword });
        return "password udpated";
    }


    async updateRefreshToken(userId: string, username: string) {
        const tokens = await this.tokenService.getTokens(userId, username);
        const hashedRefreshToken = await encryptData(tokens.refreshToken);
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashedRefreshToken }, { new: true });

        return tokens;
    }

}
