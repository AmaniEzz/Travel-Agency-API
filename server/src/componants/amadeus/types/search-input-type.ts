export interface FlightsSearchInput {
  departureDate: string;
  returnDate?: string;
  originLocationCode: string;
  destinationLocationCode: string;
  adults?: number;
  children?: number;
  maxPrice?: string;
  nonStop?: boolean;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  includedAirlineCodes?: string;
  excludedAirlineCodes?: string;
  currencyCode?: string;
  max?: number;
}
