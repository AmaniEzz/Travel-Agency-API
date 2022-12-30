import { User, UserModel } from "./user-model";
import bcrypt from "bcrypt";
import {
  accessTokenPrivateKey,
  refreshTokenPrivateKey,
  refreshTokenPublicKey,
  signJwt,
  verifyJwt,
} from "../../shared/utils/jwt";
import APIError, { errorDomain } from "../../shared/types/errors";
import { CreateUserInput } from "./types/create-user-input";
import { LoginInput } from "./types/login-input";
import { returnType } from "../../shared/types/return-type";

export class UserService {
  async signUp(input: CreateUserInput): Promise<returnType> {
    try {
      const { username, email, password, role } = input;

      // Check emptyness of the incoming data
      if (!username || !email || !password || !role) {
        throw new APIError(
          400,
          "Some required fields missing",
          errorDomain.VALIDATION_ERROR
        );
      }

      // check if the username is taken or if the email is taken
      const userExists: User = await UserModel.findOne({
        email: input.email.trim().toLowerCase(),
      }).lean();

      if (userExists) {
        throw new APIError(
          400,
          "user with this username or email already exists",
          errorDomain.USER_CREATION_ERROR
        );
      }

      // create a new user and hash it's password
      const userObj: User = Object.assign(new User(), input);

      // sign a jwt
      const access_token = signJwt(userObj, accessTokenPrivateKey);
      const refresh_token = signJwt(userObj, refreshTokenPrivateKey);
      const user = await UserModel.create(userObj);

      return {
        data: {
          user: user,
          access_token: access_token,
          refresh_token: refresh_token,
        },
      };
    } catch (error: any) {
      throw new APIError(
        400,
        error.message,
        errorDomain.USER_CREATION_ERROR,
        error
      );
    }
  }

  async login(input: LoginInput): Promise<returnType> {
    const errorMsg = "Invalid email or password";

    // Get our user by email
    const user: User = await UserModel.findOne({
      email: input.email.trim().toLowerCase(),
    }).lean();

    // if there is no user, throw an authentication error
    if (!user) {
      throw new APIError(401, errorMsg, errorDomain.FORBIDDEN);
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new APIError(401, errorMsg, errorDomain.FORBIDDEN);
    }

    // sign a jwt
    const access_token = signJwt(user, accessTokenPrivateKey);
    const refresh_token = signJwt(user, refreshTokenPrivateKey);

    // return token
    return {
      data: {
        user: user,
        access_token: access_token,
        refresh_token: refresh_token,
      },
    };
  }

  async refreshAccessToken(refresh_token: string): Promise<returnType> {
    try {
      // Validate the RefreshToken
      const user = verifyJwt<User>(refresh_token, refreshTokenPublicKey);

      // sign a new access token
      const access_token = signJwt(user, accessTokenPrivateKey);

      return { data: { access_token: access_token } };
    } catch (error) {
      throw new APIError(
        403,
        "failed to refresh access token",
        errorDomain.TOKEN_VERIFICATION_ERROR,
        error
      );
    }
  }
}
