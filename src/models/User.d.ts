import mongoose, { Document } from 'mongoose';
import { ObjectId } from '..';
export declare enum Platform {
    ios = "ios",
    android = "android"
}
export interface Device {
    id: string;
    platform: Platform;
}
export declare const UserExposedFields: string[];
export interface IUser<T = any> extends Document {
    username: string;
    displayName: string;
    avatarUrl: string;
    isAnonymous: boolean;
    email: string;
    password: string;
    passwordSalt: string;
    lang: string;
    location: string;
    timezone: string;
    metadata: T;
    devices: Device[];
    facebookId: string;
    twitterId: string;
    googleId: string;
    gameCenterId: string;
    steamId: string;
    friendIds: ObjectId[];
    blockedUserIds: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser<any>, {}>;
export default _default;
