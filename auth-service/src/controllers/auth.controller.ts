import { Request, Response } from "express";
import { config } from "dotenv";
config();
import User from "../models/UserModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerController = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    const newUser = await User.create({
      email,
      password,
      username,
    });

    res.json(newUser);
  } catch (error: any) {
    if (error.code === 11000)
      return res.json({ message: "User already exists" });

    console.log(error);
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email: email });
    if (!userExists) return res.json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, userExists.password);
    if (!isValid) return res.json({ message: "Invalid credentials" });

    if (JWT_SECRET) {
      const payload = {
        id: userExists._id,
        email: userExists.email,
      };
      const token = sign(payload, JWT_SECRET, { expiresIn: "30d" });
      res.status(200).json({token: token });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
};
