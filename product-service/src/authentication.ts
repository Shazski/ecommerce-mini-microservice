import { verify, VerifyErrors } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
config();
interface CustomRequest extends Request {
  user?: any;
}

export const isAuthenticated = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authorizationHeader.split(" ")[1];
  if (process.env.JWT_SECRET) {
    verify(
      token,
      process.env.JWT_SECRET,
      (err: VerifyErrors | null, user: any) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        } else {
          req.user = user;
          next();
        }
      }
    );
  }
};
