import { Department } from "./dep_model.js";

const createDepartment = async (req, res) => {
  const Model = Department;
  if (!req.body.departmentName) {
    return res.status(400).send({
      message: "Department name is required",
    });
  }
  const convertToLowerCase = req.body.departmentName.toLowerCase();
  const findDepartment = await Model.findOne({
    departmentName: convertToLowerCase,
  });
  if (findDepartment) {
    return res.status(200).send({
      status: "failed",
      message: "Department already exist",
    });
  } else {
    req.body.createdBy = req.user._id;
    try {
      const newDep = await Model.create({
        ...req.body,
        departmentName: convertToLowerCase,
      });
      return res.status(201).send({
        status: "OK",
        message: "Department created successfully",
        data: newDep,
      });
    } catch (error) {
      console.log(e);
      return res.status(400).send({
        message: "Error Communicating with server",
        status: "server error",
      });
    }
  }
};

const getAllDepartments = async (req, res) => {
  const Model = Department;
  if (!req.user) return res.status(400).json({ status: "failed", message: "User not found." });;
  try {
    const AllDepartments = await Model.find({ createdBy: req.user._id });
    const totalRecords = await Model.countDocuments({});
    if (AllDepartments) {
      res.status(200).json({
        status: "OK",
        totalRecords: totalRecords,
        data: AllDepartments,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error Communicating with server",
      status: "server error",
    });
  }
};

const getSingleDepartment = async (req, res) => {
  const Model = Department;
  if (!req.user)
    return res
      .status(400)
      .json({ status: "failed", message: "User not found." });
  try {
    const Department = await Model.findById(req.params.id);
    if (!Department) {
      return res.status(400).json({ status: "failed", message: "Not found" });
    }
    res.status(200).json({ status: "OK", data: Department });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error Communicating with server",
      status: "server error",
    });
  }
};

const updateDepartment = async (req, res) => {
  const Model = Department;

  if (!req.user)
    return res
      .status(400)
      .json({ status: "failed", message: "User not found." });
  let Dep = await Model.findById(req.params.id);
  if (!Dep) {
    return res.status(400).json({ status: "failed", message: "Not found" });
  }


console.log(req.body , "body")

  try {
    Dep = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ status: "OK", data: Dep });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error Communicating with server",
      status: "server error",
    });
  }
};

const deleteDepartment = async (req, res) => {
  const Model = Department;
  if (!req.user)
    return res
      .status(400)
      .json({ status: "failed", message: "You are not authorised" });

  try {
    const d = await Model.deleteOne({ _id: req.params.id });

    res.status(200).json({ status: "OK", message: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error Communicating with server",
      status: "server error",
    });
  }
};

export {
  createDepartment,
  getAllDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};
