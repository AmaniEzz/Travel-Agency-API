import Amadeus from "amadeus";
import config from "config";
import APIError, { AmadeusError, errorDomain } from "../../shared/types/errors";

/**
 *  Getting env variables
 */
import { returnType } from "../../shared/types/return-type";
import { FlightsSearchInput } from "./types/search-input-type";

/**
 * Serveic Class Definition
 */
export class AmadeusService {
  readonly amadeusClient;

  constructor() {
    this.amadeusClient = new Amadeus({
      clientId: config.get<string>("client_id"),
      clientSecret: config.get<string>("client_secret"),
    });
  }

  async citySearch(keyword: string): Promise<returnType> {
    try {
      const response = await this.amadeusClient.referenceData.locations.get({
        keyword: keyword,
        subType: "CITY,AIRPORT",
      });
      return { data: JSON.parse(response.body) };
    } catch (err: any) {
      const error: AmadeusError = err.response.result.errors;
      throw new APIError(
        error.status,
        "city airports seacrh failed",
        errorDomain.AMADEUS_ERROR,
        error
      );
    }
  }

  async searchFlights(searchInput: FlightsSearchInput): Promise<returnType> {
    try {
      const response = await this.amadeusClient.shopping.flightOffersSearch.get(
        searchInput
      );
      return { data: JSON.parse(response.body) };
    } catch (err: any) {
      const error: AmadeusError = err.response.result.errors;
      console.log(error.detail);
      throw new APIError(
        error.status,
        "flight offers seacrh failed",
        errorDomain.AMADEUS_ERROR,
        error
      );
    }
  }

  async confirmFlightPrice(flightOffers: any[]): Promise<returnType> {
    try {
      const response =
        await this.amadeusClient.shopping.flightOffers.pricing.post(
          JSON.stringify({
            data: {
              type: "flight-offers-pricing",
              flightOffers: flightOffers,
            },
          })
        );
      return { data: JSON.parse(response.body) };
    } catch (err: any) {
      const error: AmadeusError = err.response.result.errors;
      console.log(error.detail);
      throw new APIError(
        error.status,
        "flight price confirmation failed",
        errorDomain.AMADEUS_ERROR,
        error
      );
    }
  }

  async bookFlights(
    inputFlightCreateOrder: any[],
    inputTravelersDetails: any[]
  ): Promise<returnType> {
    try {
      const response = await this.amadeusClient.booking.flightOrders.post(
        JSON.stringify({
          data: {
            type: "flight-order",
            flightOffers: inputFlightCreateOrder,
            travelers: inputTravelersDetails,
          },
        })
      );
      return { data: JSON.parse(response.body) };
    } catch (err: any) {
      const error: AmadeusError = err.response.result.errors;
      console.log(error.detail);
      throw new APIError(
        error.status,
        "flight booking failed",
        errorDomain.AMADEUS_ERROR,
        error
      );
    }
  }
}
