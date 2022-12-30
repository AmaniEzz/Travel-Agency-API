import express, { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../middlewares/auth";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../shared/utils/cookies-options";
import { accessTokenPublicKey, verifyJwt } from "../../shared/utils/jwt";
import { User } from "./user-model";
import { UserService } from "./user-service";

/**
 * Router Definition
 */
export const userRouter = express.Router();

/**
 * Service Instance
 */
const service = new UserService();

/**
 * Controller Definitions
 */

// Creating register route
userRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await service.signUp(req.body);
      // Send access token with cookies
      return res
        .cookie("access_token", data?.access_token, accessTokenCookieOptions)
        .cookie("refresh_token", data?.refresh_token, refreshTokenCookieOptions)
        .json({
          success: true,
          data: data,
        });
    } catch (error) {
      // NOTE: use next() when you have to execute another callback function or middleware function
      next(error);
    }
  }
);

// Creating login routes
userRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await service.login(req.body);
      // Send access token with cookies
      return res
        .cookie("access_token", data?.access_token, accessTokenCookieOptions)
        .cookie("refresh_token", data?.refresh_token, refreshTokenCookieOptions)
        .json({
          success: true,
          data: data,
        });
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await service.refreshAccessToken(
        req.cookies.refresh_token
      );
      // Send access token with cookies
      return res
        .cookie("access_token", data?.access_token, accessTokenCookieOptions)
        .cookie("refresh_token", data?.refresh_token, refreshTokenCookieOptions)
        .json({
          success: true,
          data: data,
        });
    } catch (error) {
      next(error);
    }
  }
);

// Creating logout route
userRouter.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 0 });
      res.cookie("refresh_token", "", { maxAge: 0 });
      res.send("Successfully loged out");
    } catch (error) {
      next(error);
    }
  }
);

// get logged in user's profile
userRouter.get(
  "/profile",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = verifyJwt<User>(
        req.cookies.access_token,
        accessTokenPublicKey
      );
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);
