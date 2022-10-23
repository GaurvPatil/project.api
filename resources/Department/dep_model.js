import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DepartmentSchema = new Schema(
  {
    departmentName: {
      type: String,
      required: true,
    },
    hod: {
      type: String,
    },
    teachers: {
      type: Number,
    },
    students: {
      type: Number,
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

export const Department = model("departments", DepartmentSchema);
