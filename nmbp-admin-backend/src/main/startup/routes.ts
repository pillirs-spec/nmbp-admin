import express, { Request, Response, Express, NextFunction } from "express";
import bodyParser from "body-parser";
import { environment } from "../config";
import adminRouter from "../api/routes/adminRouter";
import usersRouter from "../api/routes/usersRouter";
import menusRouter from "../api/routes/menusRouter";
import passwordPolicyRouter from "../api/routes/passwordPoliciesRouter";
import rolesRouter from "../api/routes/rolesRouter";

export default function (app: Express): void {
  app.use(express.json());

  app.use(function (req: Request, res: Response, next: NextFunction): void {
    if (req.body) {
      const riskyChars = environment.riskyCharacters.split(",");
      for (const key in req.body) {
        if (req.body && req.body[key] && typeof req.body[key] === "string") {
          if (riskyChars.indexOf(req.body[key].charAt(0)) >= 0) {
            req.body[key] = req.body[key].slice(1);
          }
          req.body[key] = req.body[key].replace(/{|}|>|<|=/g, "");
        }
      }
    }
    res.header("Access-Control-Allow-Origin", environment.allowedOrigins);
    res.header("Access-Control-Allow-Methods", environment.allowedMethods);
    res.header("Server", "");
    res.header("Access-Control-Allow-Headers", environment.allowedHeaders);
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use("/api/v1/admin/users", usersRouter);
  app.use("/api/v1/admin/menus", menusRouter);
  app.use("/api/v1/admin/passwordPolicies", passwordPolicyRouter);
  app.use("/api/v1/admin/roles", rolesRouter);
  app.use("/api/v1/admin", adminRouter);
}
