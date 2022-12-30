import express, { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { AmadeusService } from "./amadeus-service";
import { FlightsSearchInput } from "./types/search-input-type";

/**
 * Router Definition
 */
export const amadeusRouter = express.Router();

/**
 * Service Instance
 */
const service = new AmadeusService();

/**
 * Controller Definitions
 */
amadeusRouter.get(`/city-search`, async (req: Request, res: Response) => {
  // get the search keyword from req's query
  const keyword: string = req.query.keyword as string;
  const { data } = await service.citySearch(keyword);

  res.json(data);
});

amadeusRouter.get(
  `/city-search`,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get the search keyword from req's query
      const keyword: string = req.query.keyword as string;
      const { data } = await service.citySearch(keyword);

      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

amadeusRouter.post(
  "/flights-search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await service.searchFlights(
        req.body as FlightsSearchInput
      );
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

amadeusRouter.post(
  "/flight-price",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await service.confirmFlightPrice(req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

amadeusRouter.post(
  "/flight-order",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let inputFlightCreateOrder = req.body.flights;
      let inputTravelersDetails = req.body.travelers;
      const { data } = await service.bookFlights(
        inputFlightCreateOrder,
        inputTravelersDetails
      );
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);
