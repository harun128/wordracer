import { Request, Response } from "express";
import Question from './Questions'

export let allQuestions = (req: Request, res: Response) => {
    let questions = Question.find((err: any, questions: any) => {
        if (err) {
          res.send("Error!");
        } else {
          res.send(questions);
        }
      });
};

export let getQuestion = (req: Request, res: Response) => {
    let question = Question.findById(req.params.id, (err: any, question: any) => {
        if (err) {
          //res.send(err);
        } else {
          res.send(question);
        }
      });
};

export let deleteQuestion = (req: Request, res: Response) => {
    let question = Question.deleteOne({ _id: req.params.id }, (err: any) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully Deleted Book");
        }
      });
};

export let updateQuestion = (req: Request, res: Response) => {
    let question = Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err: any, book: any) => {
          if (err) {
            res.send(err);
          } else {
            res.send({"success":true});
          }
        }
      );
};

export let addQuestion = (req: Request, res: Response) => {
    var question = new Question(req.body);
    
    question.save((err: any) => {
      if (err) {
        res.send(err);
        console.log(err);
      } else {
        res.send({"success":true});
        console.log("eklendi");
      }
    });
};