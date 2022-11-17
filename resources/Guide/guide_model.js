import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcrypt";

const GuideSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    students: [{ type: mongoose.Schema.ObjectId, ref: "students" }],

    password: {
      type: String,
      trim: true,
      required: true,
    },

    userType: {
      type: String,
      default: "guide",
    },

    department: {
      type: mongoose.Schema.ObjectId,
      ref: "departments",
      required: true,
    },

    approved: {
      type: Boolean,
      default: "false",
    },

    otp: {
      type: Number,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

GuideSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

GuideSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next) {
    const userID = this.getFilter()["_id"];
    console.log("DELETING USER", userID);

    next();
  }
);

GuideSchema.methods.checkPassword = function (password) {
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

export const Guide = model("guides", GuideSchema);
