import { Guide } from "./guide_model";
import { generate } from "generate-password";

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

export { createGuide };
