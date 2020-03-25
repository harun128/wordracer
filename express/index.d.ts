import jwt from "express-jwt";
import { AuthDataInToken } from "../src/auth";
declare global {
    namespace Express {
        interface Request {
            cauth?: AuthDataInToken;
        }
    }
}
declare const jwtMiddleware: jwt.RequestHandler;
declare const routes: import("express-serve-static-core").Router;
export { jwtMiddleware };
export default routes;
