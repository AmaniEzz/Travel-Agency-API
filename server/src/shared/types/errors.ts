export interface AmadeusError {
  status: number;
  code: number;
  title: string;
  detail: string;
  source: Source;
}
export interface Source {
  parameter: string;
  example: string;
}

export enum errorDomain {
  UNAUTHENTICATED = "UNAUTHENTICATED",
  USER_CREATION_ERROR = "USER_CREATION_ERROR",
  TOKEN_VERIFICATION_ERROR = "TOKEN_VERIFICATION_ERROR",
  TOKEN_GENERATION_ERROR = "TOKEN_GENERATION_ERROR",
  FORBIDDEN = "FORBIDDEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AMADEUS_ERROR = "AMADEUS_ERROR",
  USER_NOT_FOUND = "USER_NOT_FOUND",
}

export default class APIError extends Error {
  statusCode?: number;
  domain?: errorDomain;
  description?: string;
  extra?: any;

  constructor(
    statusCode: number,
    message: string,
    domain?: errorDomain,
    extra?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.statusCode = statusCode;
    this.domain = domain;
    this.description = this.message;
    this.extra = extra || null;

    Error.captureStackTrace(this);
  }
}
