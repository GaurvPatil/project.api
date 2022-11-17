// packages
import express, { urlencoded, json } from "express";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";
import expressListRoutes from "express-list-routes";
import { connect } from "./util/db.js";
import { SECRETS } from "./util/config.js";
config();
const app = express();
const PORT = process.env.PORT || 8080;

import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);
import helmet from "helmet";

app.use(helmet());
app.use((req, res, next) => {
  res.set("X-XSS-Protection", "1; mode=block");
  res.set("X-Frame-Options", "deny");
  res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});
app.use(helmet.hidePoweredBy());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
//endpoint shows Server Running
app.get("/", (req, res) => {
  res.json(`Server is Running : ${new Date().toLocaleString()}`);
});

import { User } from "./resources/user/user_model.js";
import { adminSignUp, adminSignin, adminProtect } from "./util/auth.js";
import GuideRouter from "./resources/Guide/guide_router.js";
import DepartmentRouter from "./resources/Department/dep_router.js";


// helper 
import { getDashBoardCount } from "./resources/Helper/helper_controller.js";

export const userModel = (req, res, next) => {
  req.model = User;
  next();
};

//Auth Routes
app.post("/admin-signup", userModel, adminSignUp);
app.post("/admin-signin", userModel, adminSignin);

// routes
app.use("/api/guide", GuideRouter);
app.use("/api/department", adminProtect, DepartmentRouter);



// helper 
app.get("/api/getdashboardcount" , adminProtect , getDashBoardCount)


export const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      if (SECRETS.node_env === "development") {
        expressListRoutes(app);
      }
      console.log(`REST API on http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};
