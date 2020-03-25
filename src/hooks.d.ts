import { ObjectId, IUser, AuthProvider } from ".";
export declare const hooks: {
    /**
     * Triggered before registering or authenticating a user.
     */
    beforeAuthenticate: {
        (this: any, cb: (provider: AuthProvider, $setOnInsert: Partial<IUser<any>>, $set?: Partial<IUser<any>>) => void): import("strong-events/lib").EventEmitter<(provider: AuthProvider, $setOnInsert: Partial<IUser<any>>, $set?: Partial<IUser<any>>) => void>;
        once(cb: (provider: AuthProvider, $setOnInsert: Partial<IUser<any>>, $set?: Partial<IUser<any>>) => void): void;
        remove(cb: (provider: AuthProvider, $setOnInsert: Partial<IUser<any>>, $set?: Partial<IUser<any>>) => void): void;
        invoke(provider: AuthProvider, $setOnInsert: Partial<IUser<any>>, $set?: Partial<IUser<any>>): void;
        invokeAsync(provider: AuthProvider, $setOnInsert: Partial<IUser<any>>, $set?: Partial<IUser<any>>): Promise<any[]>;
        clear(): void;
    };
    /**
     * Triggered before updating a user.
     */
    beforeUserUpdate: {
        (this: any, cb: (_id: ObjectId, fields: Partial<IUser<any>>) => void): import("strong-events/lib").EventEmitter<(_id: ObjectId, fields: Partial<IUser<any>>) => void>;
        once(cb: (_id: ObjectId, fields: Partial<IUser<any>>) => void): void;
        remove(cb: (_id: ObjectId, fields: Partial<IUser<any>>) => void): void;
        invoke(_id: ObjectId, fields: Partial<IUser<any>>): void;
        invokeAsync(_id: ObjectId, fields: Partial<IUser<any>>): Promise<any[]>;
        clear(): void;
    };
};
