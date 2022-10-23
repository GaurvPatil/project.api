import { Router } from "express";
import { adminProtect } from "../../util/auth.js";

import { createGuide } from "./guide_controller.js";

const router = Router();

router.route("/").post(adminProtect, createGuide);

export default router;
