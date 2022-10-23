import { newToken, verifyToken } from "./jwt";
import { User } from "../resources/user/user_model";

const adminSignUp = async (req, res) => {
  const Model = req.model;
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "All fields required",
    });
  }

  const user = await Model.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(200)
      .send({ status: "failed", message: "Email is already in use" });
  } else {
    try {
      const user = await Model.create({ ...req.body, approved: true });
      return res.status(201).send({
        status: "OK",
        message: "User created successfully",
        data: user,
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

const adminSignin = async (req, res) => {
  const Model = req.model;

  if (!req.body.email || !req.body.password)
    return res
      .status(400)
      .send({ status: "failed", message: "Email and password required" });
  const user = await Model.findOne({ email: req.body.email }).exec();

  if (!user) {
    return res
      .status(400)
      .send({ status: "failed", message: "Email not registered" });
  }

  try {
    const match = await user.checkPassword(req.body.password);
    if (!match || user.userType !== "admin") {
      return res
        .status(401)
        .send({ status: "failed", message: "Invalid Email or Password" });
    }
    if (!user.approved) {
      return res
        .status(401)
        .send({
          status: "failed",
          message: "Please contact admin to approve ur account",
        });
    }
    const token = newToken(user);
    return res
      .status(201)
      .send({ status: "OK", token: token, email: req.body.email });
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

const adminProtect = async (req, res, next) => {
  const Model = User;

 
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "User not authorized" });
  }
  let token = req.headers.authorization.split("Bearer ")[1];


  if (!token) {
    return res.status(401).send({ message: "Token not found" });
  }
  try {
   
    const payload = await verifyToken(token);

    const user = await Model.findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    req.user = user;
 
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

export { adminSignUp, adminSignin, adminProtect };
