import { Router } from "express";
import {
  createDepartment,
  getAllDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
} from "./dep_controller";

const router = Router();

router.route("/").post(createDepartment).get(getAllDepartments);

router
  .route("/:id")
  .get(getSingleDepartment)
  .delete(deleteDepartment)
  .patch(updateDepartment);

export default router;
