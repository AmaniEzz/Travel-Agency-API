import express from "express";
import cors from "cors";
import config from "config";
import APIError from "./shared/types/errors";
import cookieParser from "cookie-parser";
import { urlencoded, json } from "body-parser";
import { amadeusRouter } from "./componants/amadeus/amadeus-routes";
import { userRouter } from "./componants/user/user-routes";
import { connectToMongo } from "./shared/utils/connect-database";
import { errorhandler } from "./middlewares/error-handler";
import { Request, Response, NextFunction } from "express";

/**
 * Configure express
 */
const app = express();
app.use(cors());
app.use(cookieParser()); // to access the token stored in the cookie
app.use(express.json());
app.use(json()); // to support json encoded bodies
app.use(urlencoded({ extended: true }));

/**
 *  App routes
 */
app.use("/air/", amadeusRouter);
app.use("/user/", userRouter);

/**
 *  Error handling middleware (centralized error handler)
 */
app.use(
  async (err: APIError, req: Request, res: Response, next: NextFunction) => {
    await errorhandler.handleError(err, res);
  }
);

process.on("uncaughtException", (error: APIError, res: Response) => {
  errorhandler.handleError(error, res);
});

process.on("unhandledRejection", (error: APIError, res: Response) => {
  errorhandler.handleError(error, res);
});

// handle "Resource not found" errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Resource not found",
  });
});

/**
 *  connect to database
 */
connectToMongo();

/**
 * app.listen on express server
 */
const port = config.get<string>("port");
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
