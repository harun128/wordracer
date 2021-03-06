"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
var nanoid_1 = __importDefault(require("nanoid"));
var User_1 = __importStar(require("./models/User"));
exports.User = User_1.default;
var facebook_1 = require("./facebook");
var env_1 = require("./env");
var FriendRequest_1 = __importDefault(require("./models/FriendRequest"));
exports.FriendRequest = FriendRequest_1.default;
var auth_1 = require("./auth");
exports.verifyToken = auth_1.verifyToken;
var hooks_1 = require("./hooks");
exports.hooks = hooks_1.hooks;
var debug = require('debug')('@colyseus/social');
var DEFAULT_USER_FIELDS = ['_id', 'username', 'displayName', 'avatarUrl', 'metadata'];
var ONLINE_SECONDS = 20;
function connectDatabase(cb) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // skip if already connecting or connected.
                    if (mongoose_1.default.connection.readyState !== 0) {
                        if (cb)
                            cb(null);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, mongoose_1.default.connect(env_1.MONGO_URI, { autoIndex: false, useNewUrlParser: true, useUnifiedTopology: true }, cb)];
                case 2:
                    _a.sent();
                    debug("Successfully connected to " + env_1.MONGO_URI);
                    // reconnect if disconnected.
                    mongoose_1.default.connection.on('disconnected', function () { return connectDatabase(); });
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error('Error connecting to database: ', e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.connectDatabase = connectDatabase;
function pingUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.default.updateOne({ _id: userId }, { $set: { updatedAt: new Date() } })];
                case 1: return [2 /*return*/, (_a.sent()).nModified > 0];
            }
        });
    });
}
exports.pingUser = pingUser;
function authenticate(_a) {
    var accessToken = _a.accessToken, deviceId = _a.deviceId, platform = _a.platform, email = _a.email, password = _a.password, token = _a.token;
    return __awaiter(this, void 0, void 0, function () {
        var provider, $filter, $set, $setOnInsert, friendIds, facebookFriendsIds, _id, existingUser, data, _b, salt, hash, filter, currentUser;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    $filter = {};
                    $set = {};
                    $setOnInsert = {};
                    friendIds = [];
                    facebookFriendsIds = [];
                    _id = token && auth_1.verifyToken(token)._id;
                    if (!accessToken) return [3 /*break*/, 4];
                    provider = 'facebook';
                    return [4 /*yield*/, facebook_1.getFacebookUser(accessToken)];
                case 1:
                    data = _c.sent();
                    $filter['facebookId'] = data.id;
                    $set['facebookId'] = data.id; // upgrading from user token
                    $set['avatarUrl'] = data.picture.data.url;
                    $set['isAnonymous'] = false;
                    $setOnInsert['username'] = "" + data.short_name + data.id;
                    if (data.name) {
                        $setOnInsert['displayName'] = data.name;
                    }
                    if (data.email) {
                        $setOnInsert['email'] = data.email;
                    }
                    if (data.friends) {
                        facebookFriendsIds = data.friends.data.map(function (friend) { return friend.id; });
                    }
                    if (!(facebookFriendsIds.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, User_1.default.
                            find({ facebookId: { $in: facebookFriendsIds } }, ["_id"])];
                case 2:
                    friendIds = (_c.sent()).
                        map(function (user) { return user._id; });
                    _c.label = 3;
                case 3: return [3 /*break*/, 7];
                case 4:
                    if (!email) return [3 /*break*/, 6];
                    provider = 'email';
                    // validate password provided
                    if (!password || password.length < 3) {
                        throw new Error("password missing");
                    }
                    return [4 /*yield*/, User_1.default.findOne({ email: email })];
                case 5:
                    // email + password auth
                    existingUser = _c.sent();
                    if (existingUser) {
                        // login via email + password
                        if (auth_1.isValidPassword(existingUser, password)) {
                            return [2 /*return*/, existingUser];
                        }
                        else {
                            throw new Error("invalid credentials");
                        }
                    }
                    else {
                        _b = auth_1.hashPassword(password), salt = _b.salt, hash = _b.hash;
                        // create new user with email + password
                        $filter['email'] = email;
                        $set['email'] = email; // upgrading from user token
                        $set['password'] = hash;
                        $set['passwordSalt'] = salt;
                        $set['isAnonymous'] = false;
                    }
                    return [3 /*break*/, 7];
                case 6:
                    if (!_id) {
                        provider = 'anonymous';
                        // anonymous auth
                        if (!deviceId) {
                            deviceId = nanoid_1.default();
                        }
                        // $filter['devices'] = { id: deviceId, platform: platform };
                        $filter['devices.id'] = deviceId;
                        $filter['devices.platform'] = platform;
                        // only allow anonymous login if account is not connected with external services
                        $filter['facebookId'] = { $exists: false };
                        $filter['twitterId'] = { $exists: false };
                        $filter['googleId'] = { $exists: false };
                        $setOnInsert['isAnonymous'] = true;
                    }
                    _c.label = 7;
                case 7:
                    /**
                     * allow end-user to modify `$setOnInsert` / `$set` values
                     */
                    hooks_1.hooks.beforeAuthenticate.invoke(provider, $setOnInsert, $set);
                    if (!(Object.keys($filter).length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, User_1.default.findOne($filter)];
                case 8:
                    existingUser = _c.sent();
                    _c.label = 9;
                case 9:
                    filter = (existingUser)
                        ? { _id: existingUser._id }
                        : (_id)
                            ? { _id: _id }
                            : $filter;
                    // find or create user
                    return [4 /*yield*/, User_1.default.updateOne(filter, {
                            $setOnInsert: $setOnInsert,
                            $set: $set,
                            $addToSet: { friendIds: friendIds }
                        }, { upsert: true })];
                case 10:
                    // find or create user
                    _c.sent();
                    return [4 /*yield*/, User_1.default.findOne(filter)];
                case 11:
                    currentUser = _c.sent();
                    if (!(facebookFriendsIds.length > 0)) return [3 /*break*/, 13];
                    return [4 /*yield*/, Promise.all(facebookFriendsIds.map(function (facebookId) {
                            return User_1.default.updateOne({ facebookId: facebookId }, {
                                $addToSet: { friendIds: currentUser._id }
                            });
                        }))];
                case 12:
                    _c.sent();
                    _c.label = 13;
                case 13: return [2 /*return*/, currentUser];
            }
        });
    });
}
exports.authenticate = authenticate;
function updateUser(_id, fields) {
    return __awaiter(this, void 0, void 0, function () {
        var $set, _i, UserExposedFields_1, field, found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    $set = {};
                    // filter only exposed fields
                    for (_i = 0, UserExposedFields_1 = User_1.UserExposedFields; _i < UserExposedFields_1.length; _i++) {
                        field = UserExposedFields_1[_i];
                        if (typeof (fields[field]) !== "undefined") {
                            $set[field] = fields[field];
                        }
                    }
                    if (!$set['username']) return [3 /*break*/, 2];
                    return [4 /*yield*/, User_1.default.findOne({ username: $set['username'] }, { _id: 1 })];
                case 1:
                    found = _a.sent();
                    if (found && found._id !== _id) {
                        throw new Error("username taken");
                    }
                    _a.label = 2;
                case 2: 
                // trigger custom before user update
                return [4 /*yield*/, hooks_1.hooks.beforeUserUpdate.invokeAsync(_id, $set)];
                case 3:
                    // trigger custom before user update
                    _a.sent();
                    return [4 /*yield*/, User_1.default.updateOne({ _id: _id }, { $set: $set })];
                case 4: return [2 /*return*/, (_a.sent()).nModified > 0];
            }
        });
    });
}
exports.updateUser = updateUser;
function assignDeviceToUser(user, deviceId, platform) {
    return __awaiter(this, void 0, void 0, function () {
        var existingDevice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingDevice = user.devices.filter(function (device) {
                        return device.id === deviceId && device.platform === platform;
                    })[0];
                    if (!!existingDevice) return [3 /*break*/, 2];
                    user.devices.push({ id: deviceId, platform: platform });
                    return [4 /*yield*/, user.save()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.assignDeviceToUser = assignDeviceToUser;
function getOnlineUserCount() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.default.countDocuments({
                        updatedAt: { $gte: Date.now() - 1000 * ONLINE_SECONDS }
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getOnlineUserCount = getOnlineUserCount;
function sendFriendRequest(senderId, receiverId) {
    return __awaiter(this, void 0, void 0, function () {
        var isAllowedToSend;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.default.findOne({
                        _id: receiverId,
                        blockedUserIds: { $nin: [senderId] }
                    })];
                case 1:
                    isAllowedToSend = _a.sent();
                    if (!(isAllowedToSend !== null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, FriendRequest_1.default.updateOne({
                            sender: senderId,
                            receiver: receiverId
                        }, {}, {
                            upsert: true
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3: return [2 /*return*/, false];
            }
        });
    });
}
exports.sendFriendRequest = sendFriendRequest;
function consumeFriendRequest(receiverId, senderId, accept) {
    if (accept === void 0) { accept = true; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!accept) return [3 /*break*/, 3];
                    return [4 /*yield*/, User_1.default.updateOne({ _id: receiverId }, { $addToSet: { friendIds: senderId } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, User_1.default.updateOne({ _id: senderId }, { $addToSet: { friendIds: receiverId } })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, FriendRequest_1.default.deleteOne({ sender: senderId, receiver: receiverId })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.consumeFriendRequest = consumeFriendRequest;
function blockUser(userId, blockedUserId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.default.updateOne({ _id: userId }, {
                        $addToSet: { blockedUserIds: blockedUserId },
                        $pull: { friendIds: blockedUserId }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, User_1.default.updateOne({ _id: blockedUserId }, {
                            $pull: { friendIds: userId }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, FriendRequest_1.default.deleteOne({ sender: blockedUserId, receiver: userId })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.blockUser = blockUser;
function unblockUser(userId, blockedUserId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.default.updateOne({ _id: userId }, {
                        $addToSet: { friendIds: blockedUserId },
                        $pull: { blockedUserIds: blockedUserId }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.unblockUser = unblockUser;
function getFriendRequests(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, FriendRequest_1.default.find({ receiver: userId })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getFriendRequests = getFriendRequests;
function getFriendRequestsProfile(friendRequests, fields) {
    if (fields === void 0) { fields = DEFAULT_USER_FIELDS; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.default.find({ _id: { $in: friendRequests.map(function (request) { return request.sender; }) } }, fields)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getFriendRequestsProfile = getFriendRequestsProfile;
function getFriends(user, fields) {
    if (fields === void 0) { fields = DEFAULT_USER_FIELDS; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.default.find({ _id: { $in: user.friendIds } }, fields)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getFriends = getFriends;
function getOnlineFriends(user, fields) {
    if (fields === void 0) { fields = DEFAULT_USER_FIELDS; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.default.find({
                        _id: { $in: user.friendIds },
                        updatedAt: { $gte: Date.now() - 1000 * ONLINE_SECONDS }
                    }, fields)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getOnlineFriends = getOnlineFriends;
// export async function logout(userId: string | mongoose.Schema.Types.ObjectId) {
//     return await User.updateOne({ _id: userId }, { $set: { online: false } });
// }
