import { Response } from "express";
import APIError from "../shared/types/errors";

class ErrorHandler {
  public async handleError(error: APIError, response: Response): Promise<void> {
    const status = error.statusCode || 500;
    response.status(status).send({ error });
  }
}

export const errorhandler = new ErrorHandler();
