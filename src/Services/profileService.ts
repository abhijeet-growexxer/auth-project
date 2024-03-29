import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as otpGenerator from 'otp-generator';
import { UpdateUserEmailModel, UserUpdateModel } from "src/Models/UserModels";
import { User, UserDocument } from "src/Schemas/User.schema";
import { Constants } from "src/utils/constants";
import { sendEmail } from "src/utils/sendEmail";
import * as gravatar from "gravatar";

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    //returns info of the user
    async getUser(userId: string) {
        return this.userModel.findById(userId, '_id name username avatar phone  email verified role');
    }

    async getAllUsers(userId: string) {
        return this.userModel.find({ _id: { $ne: userId }, role: { $ne: 0 } }, '_id name avatar email')
    }

    async updateUserDetails(userId: string, userDetails: UserUpdateModel) {
        const user = await this.userModel.findById(userId, 'verified')
        if (!user.verified) {
            throw new ConflictException("Cannot update user details , user not yet verified")
        }
        const { username, name, phone } = userDetails
        const usernameExists = await this.userModel.findOne({ username })
        if (usernameExists) { 
            throw new ConflictException("Username already taken")
        }
        if (!Constants.NAME.test(name)) {
            throw new BadRequestException("Invalid name")
        }
        await this.userModel.findByIdAndUpdate({ _id: userId }, { username, name, phone })
        return "user details updated successfully"
    }

    async updateUserEmail(userId: string, userEmail: string) {
        if (!Constants.EMAIL.test(userEmail)) {
            throw new BadRequestException("Invalid email address")
        }
        
        const user = await this.userModel.findById(userId)
        if (user.email === userEmail) {
            throw new ConflictException("Email Address is same")
        }
        const emailExists = await this.userModel.findOne({ email: userEmail })
        if (emailExists) { 
            throw new ConflictException("Email Address already registered")
        }
        const verifyOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: true, digits: true });
        sendEmail(userEmail, 'Email Confirmation', `Enter the verification OTP to update your Email address 
        OTP: ${verifyOTP}`);

        await this.userModel.findByIdAndUpdate({ _id: userId }, { verificationOTP: verifyOTP })
        return "Please Verfiy the OTP sent to your Email"
    }

    async verifyEmailOTP(userId: string, updateUserEmailModel: UpdateUserEmailModel) {
        const { email, otp } = updateUserEmailModel
        const user = await this.userModel.findById(userId)
        const verficiationOTP = user?.verificationOTP
        if (otp == verficiationOTP) {
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            await this.userModel.findByIdAndUpdate(userId, { verificationOTP: null, email, avatar })
        }
        return "Email Id verified"
    }
}