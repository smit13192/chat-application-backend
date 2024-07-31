import { model, Schema } from "mongoose";
import { compareHash, hashPassword } from "../utils/hash";

interface IUser {
    email: string;
    username: string;
    password: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserMethods {
    comparePassword: (encryptPassword: string) => boolean;
}

const userSchema = new Schema<IUser, {}, IUserMethods>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://cdn1.iconfinder.com/data/icons/bokbokstars-121-classic-stock-icons-1/512/person-man.png",
    }
},
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = hashPassword(this.password);
    }
    next();
});

userSchema.methods.comparePassword = function comparePassword(
    encryptPassword: string
): boolean {
    return compareHash(encryptPassword, this.password);
};

const UserModel = model('users', userSchema);

export default UserModel;

export const userSelect: string[] = ["username", "email", "image", "__v", "updatedAt", "createdAt"];