import * as mongoose from "mongoose";

export interface IQuestion extends mongoose.Document {
    question: string;
    answer: number;
  }
  
  export const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
  });

  const Question = mongoose.model<IQuestion>("questions", QuestionSchema);
  export default Question;