import jwt, { JsonWebTokenError } from "jsonwebtoken";
import config from "config";

// Cookie Options
export const accessTokenExpiresIn = config.get<number>("accessTokenExpiresIn");
export const refreshTokenExpiresIn = config.get<number>(
  "refreshTokenExpiresIn"
);

export const accessTokenPrivateKey = Buffer.from(
  config.get<string>("accessTokenPrivateKey"),
  "base64"
).toString("ascii");

export const accessTokenPublicKey = Buffer.from(
  config.get<string>("accessTokenPublicKey"),
  "base64"
).toString("ascii");

export const refreshTokenPrivateKey = Buffer.from(
  config.get<string>("refreshTokenPrivateKey"),
  "base64"
).toString("ascii");

export const refreshTokenPublicKey = Buffer.from(
  config.get<string>("refreshTokenPublicKey"),
  "base64"
).toString("ascii");

export function signJwt(
  object: Object,
  privateKey: string,
  options?: jwt.SignOptions | undefined
): string {
  try {
    const token = jwt.sign(JSON.parse(JSON.stringify(object)), privateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
    return token;
  } catch (e: any) {
    throw new JsonWebTokenError(e);
  }
}

export function verifyJwt<T>(token: string, key: string): T {
  try {
    const decoded = jwt.verify(token, key) as T;
    return decoded;
  } catch (e: any) {
    throw new JsonWebTokenError(e);
  }
}
