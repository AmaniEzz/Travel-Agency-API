import { Request, Response, NextFunction } from "express";
import { User } from "../componants/user/user-model";
import APIError, { errorDomain } from "../shared/types/errors";
import { accessTokenPublicKey, verifyJwt } from "../shared/utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.access_token || "";

  if (token) {
    try {
      verifyJwt<User>(token, accessTokenPublicKey);
      next();
    } catch (err) {
      res
        .status(403)
        .send(
          new APIError(
            403,
            "Wrong authentication token",
            errorDomain.UNAUTHENTICATED
          )
        );
    }
  } else {
    res
      .status(401)
      .send(
        new APIError(
          401,
          "Authentication token missing",
          errorDomain.UNAUTHENTICATED
        )
      );
  }
}
