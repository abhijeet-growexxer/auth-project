import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { AuthGuard } from "@nestjs/passport";
import { Model } from "mongoose";
import { User, UserDocument } from "src/Schemas/User.schema";
import { UserRole } from "../utils/enums";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, @InjectModel(User.name) private userModel: Model<UserDocument>) {

    }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        // console.log(requiredRoles)
        if (!requiredRoles) {
            return true;
        }
        // // successfull authentication, user is injected
        const { user } = context.switchToHttp().getRequest();
        const { sub } = user
        const { role } = await this.userModel.findById(sub, { role: true })
        return requiredRoles.includes(role)
    }
}