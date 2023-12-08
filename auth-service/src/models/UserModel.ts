import { Schema, Document, model } from "mongoose";
import bcrypt from "bcrypt";
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, 10, function (err: any, hash: string) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

const User = model<IUser>("User", userSchema);

export default User;
