import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcrypt";




const UserSchema = new Schema(
  {

  email: {
    type: String,
    required: true,
  },
    password: {
      type: String,
      trim: true,
      required: true,
    },

    userType: {
      type: String,
      default: "admin" //Admin , Project-Incharge user employer
    },

    approved: {
      type: Boolean,
      default: "false"
    },
    otp: {
      type: Number,
      default: null
    },

    active: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next) {
    const userID = this.getFilter()["_id"];
    console.log("DELETING USER", userID);

    next();
  }
);

UserSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

export const User = model("users", UserSchema);