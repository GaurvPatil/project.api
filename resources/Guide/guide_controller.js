import { Guide } from "./guide_model.js";
import { generate } from "generate-password";
import { adminProtect, guideProtect } from "../../util/auth.js";

const createGuide = async (req, res) => {
  const Model = Guide;
  if (!req.body.email) {
    return res.status(400).send({
      message: "Email is required",
    });
  }

  const guide = await Model.findOne({ email: req.body.email });
  if (guide) {
    return res
      .status(200)
      .send({ status: "failed", message: "Email is already in use" });
  } else {
    req.body.createdBy = req.user._id;
    let password = generate({
      length: 8,
      lowercase: true,
      numbers: true,
      uppercase: true,
      symbols: true,
      strict: true,
    });
    password.toString();

    try {
      const guide = await Model.create({
        ...req.body,
        approved: true,
        password: password,
      });
      return res.status(201).send({
        status: "OK",
        message: "Guide created successfully",
        data: guide,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        message: "Error Communicating with server",
        status: "server error",
      });
    }
  }
};

// student schemaa remaining
const getAllGuides = async (req, res) => {
  const Model = Guide;
  if (!req.user)
    return res
      .status(400)
      .json({ status: "failed", message: "User not found." });
  try {
    const totalRecords = await Model.countDocuments({});
    await Model.find({ createdBy: req.user._id })
      .populate("department")
      // .populate("students")
      .exec(function (err, results) {
        console.log(err);
        if (err) {
          res.status(500).json({
            status: "failed",
            message: "data fetching error",
          });
        }

        if (results) {
          res.status(200).json({
            status: "OK",
            totalRecords: totalRecords,
            data: results,
          });
        }
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error Communicating with server",
      status: "server error",
    });
  }
};

const getSingleGuide = async (req, res) => {
  const Model = Guide;

  if (req?.user?._id.length < 1 || !req?.guide?._id.length < 1) {
    return res
      .status(400)
      .json({ status: "failed", message: "You are not authorised" });
  }

  try {
    await Model.findById(req.params.id)
      .populate("department")
      // .populate("students")
      .exec(function (err, results) {
        console.log(err);
        if (err) {
          res.status(500).json({
            status: "failed",
            message: "data fetching error",
          });
        }

        if (results) {
          res.status(200).json({
            status: "OK",
            data: results,
          });
        }
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error Communicating with server",
      status: "server error",
    });
  }
};

const deleteGuide = async (req, res) => {
  const Model = Guide;
  if (!req.user)
    return res
      .status(400)
      .json({ status: "failed", message: "You are not authorised" });

  try {
    await Model.deleteOne({ _id: req.params.id });

    res.status(200).json({ status: "OK", message: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error Communicating with server",
      status: "server error",
    });
  }
};

const updateGuide = async (req, res) => {

   const Model = Guide;


  if (req?.user?._id.length < 1 || !req?.guide?._id.length < 1) {
    return res
      .status(400)
      .json({ status: "failed", message: "You are not authorised" });
  }

  let guide = await Model.findById(req.params.id);
  if (!guide) {
    return res.status(400).json({ status: "failed", message: "Not found" });
  }
  try {
    guide = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ status: "OK", data: guide });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error Communicating with server",
      status: "server error",
    });
  }
};

export { createGuide, getAllGuides, getSingleGuide, deleteGuide, updateGuide };
