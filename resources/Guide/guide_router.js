import { Router } from "express";
import { adminProtect, guideProtect } from "../../util/auth.js";

import {
  createGuide,
  getAllGuides,
  getSingleGuide,
  deleteGuide,
  updateGuide,
} from "./guide_controller.js";

const router = Router();

router
  .route("/")
  .post(adminProtect, createGuide)
  .get(adminProtect, getAllGuides);
router
  .route("/:id")
  .get(adminProtect, guideProtect, getSingleGuide)
  .delete(adminProtect, deleteGuide)
  .patch(adminProtect, guideProtect, updateGuide);

export default router;
