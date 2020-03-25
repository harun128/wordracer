import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId, hooks } from '..';
import { SchemaSerializer } from 'colyseus';

export interface Chat {
    sender : Schema.Types.ObjectId,
    receiver : Schema.Types.ObjectId,
    message : String
};

export interface IConversations<T=any> extends Document {
    receiver : Schema.Types.ObjectId,
    sender : Schema.Types.ObjectId,
    chats : Chat[]

};

const ChatSchema = new mongoose.Schema({
    sender: Schema.Types.ObjectId,
    receiver: Schema.Types.ObjectId,
    message : String
}, {
    _id: false
});

const ConversationSchema: Schema<IConversations> = new Schema<IConversations>({
    receiver : {type:Schema.Types.ObjectId},
    sender : { type: Schema.Types.ObjectId},
    chats : [ChatSchema]

}, {
    timestamps: true,
});

export default mongoose.model<IConversations>('Conversations', ConversationSchema);