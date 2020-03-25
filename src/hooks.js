"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strong_events_1 = require("strong-events");
exports.hooks = {
    /**
     * Triggered before registering or authenticating a user.
     */
    beforeAuthenticate: strong_events_1.createSignal(),
    /**
     * Triggered before updating a user.
     */
    beforeUserUpdate: strong_events_1.createSignal()
};

// /**
//  * Default before update hook: `username` must be unique!
//  */
// hooks.beforeUserUpdate(async (_id, fields) => {
//     console.log("VALIDATE 'username'");
//     if (fields['username']) {
//         const found = await User.findOne({ username: fields['username'] }, { _id: 1 });
//         if (found && found._id !== _id) {
//             throw new Error("username taken");
//         }
//     }
// });
