import { BcryptAdapter } from "../../Infrastructure/bcryptAdapter";
import { JWTAdapter } from "../../Infrastructure/jwt";
import { UserRepository } from "../../domain/interface/userRepositoryInterface";
import { FirstBatch, UserWithID } from "../../types/TypesAndInterfaces";
import { User } from "../../domain/entity/userEntity";
import dotEnv from "dotenv";
import { AuthSeviceInteface } from "../../types/serviceLayerInterfaces";
import { objectIdToString } from "../../interface/Utility/objectIdToString";

dotEnv.config();

///////////////checking completed/////////////////

export class AuthService implements AuthSeviceInteface {
  private bcryptAdapter: BcryptAdapter;
  private jwtGenerator: JWTAdapter;
  private userRepository: UserRepository;

  constructor(
    userRepository: UserRepository,
    bcryptAdapter: BcryptAdapter,
    jwtGenerator: JWTAdapter
  ) {
    this.bcryptAdapter = bcryptAdapter;
    this.jwtGenerator = jwtGenerator;
    this.userRepository = userRepository;
  }
  async signupFirstBatch(firstBatch: FirstBatch) {  
    const hashedPassoword = await this.bcryptAdapter.hash(firstBatch.PASSWORD);
    const user: User = {
      PersonalInfo: {
        firstName: firstBatch["FIRST NAME"],
        secondName: firstBatch["SECOND NAME"],
        state: firstBatch["STATE THAT YOU LIVE"],
        gender: firstBatch["YOUR GENDER"],
        dateOfBirth: new Date(firstBatch["DATE OF BIRTH"]),
      },
      partnerData: {
        gender: firstBatch["GENDER OF PARTNER"],
      },
      email: firstBatch.EMAIL,
      password: hashedPassoword,
      block: false,
      match: [],
      PlanData: [],
      subscriber: "Not subscribed",
      CreatedAt: new Date(),
    };
    try {
      const response: UserWithID = await this.userRepository.create(user);
      if (response && response._id) {
        const key = process.env.JWT_SECRET_USER || "123";
        const id = JSON.stringify(response._id) || "123";
        const preferedGender = response.partnerData.gender;
        const gender = response.PersonalInfo.gender;
        const token = this.jwtGenerator.createToken(
          { id: id, role: "user", preferedGender, gender },
          key,
          { expiresIn: "1 hours" }
        );
        return { user, token };
      } else {
        throw new Error("internal server error on signup");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new Error("user not found");
      }
      if (user) {
        const isMatch = await this.bcryptAdapter.compare(
          password,
          user.password
        );

        if (isMatch) {
          const preferedGender = user.partnerData.gender;
          const gender = user.PersonalInfo.gender;

          const jwt_key: string = process.env.JWT_SECRET_USER || "";
          const token = this.jwtGenerator.createToken(
            {
              id: JSON.stringify(user._id),
              role: "user",
              preferedGender,
              gender,
            },
            jwt_key,
            { expiresIn: "6 hour" }
          );
          const photo = user.PersonalInfo.image || "";
          return {
            token,
            name: user.PersonalInfo.firstName,
            partner: user.partnerData.gender,
            photo: photo,
            gender: user.PersonalInfo.gender,
            subscriptionStatus: user.subscriber,
          };
        } else {
          throw new Error("password not matched");
        }
      } else {
        throw new Error("user not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async passwordChange(email: string, password: string) {
    try {
      const hashed = await this.bcryptAdapter.hash(password);

      if (email && hashed) {
        const response = await this.userRepository.changePassword(
          email,
          hashed
        );

        return response;
      } else {
        throw new Error("error on password reseting");
      }
    } catch (error) {
      throw new Error("error on password reseting");
    }
  }

  async changePasswordEditProfile(password: unknown, id: unknown) {
    if (typeof password !== "string" || typeof id !== "string") {
      throw new Error("error on password changing");
    }
    try {
      const email: any = await this.userRepository.findEmailByID(id);

      if (!email) {
        throw new Error("error on password changing");
      }
      const response = await this.passwordChange(email?.email, password);
      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  degenerateToken(
    id: unknown,
    role: "user" | "admin",
    preferedGender: string,
    gender: string
  ) {
    if (typeof id !== "string") {
      throw new Error("error on id");
    }
    try {
      const information = {
        id,
        role,
        preferedGender,
        gender,
      };
      const newToken = this.jwtGenerator.createToken(
        information,
        role === "admin"
          ? process.env.JWT_SECRET_ADMIN || ""
          : process.env.JWT_SECRET_USER || "",
        { expiresIn: "6 hours" }
      );
      return newToken;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
