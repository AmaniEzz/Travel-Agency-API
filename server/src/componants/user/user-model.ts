import { getModelForClass, prop, pre, index } from "@typegoose/typegoose";
import { modelOptions } from "@typegoose/typegoose/lib/modelOptions";
import bcrypt from "bcrypt";

export enum Role {
  customer = "customer",
  admin = "admin",
}

@pre<User>("save", async function () {
  // Check that the password is being modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const password = this.password;
  const hashed = await bcrypt.hash(password, salt);
  this.password = hashed;
})
@index({ email: 1 })
@modelOptions({ schemaOptions: { collection: "user", timestamps: true } })
export class User {
  _id!: string;

  @prop({ required: true })
  username!: string;

  @prop({ required: false })
  firstName?: string;

  @prop({ required: false })
  lastName?: string;

  @prop({ required: true, type: String })
  role!: Role[];

  @prop({ required: true, lowercase: true })
  email!: string;

  @prop({ required: true })
  password!: string;
}

export const UserModel = getModelForClass(User);
