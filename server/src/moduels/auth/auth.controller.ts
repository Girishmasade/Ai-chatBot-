import type { NextFunction, Request, Response } from "express";

export const registerAccount = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    

  } catch (error) {
    console.log(error);
    next(error);
  }
};
