import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { logger, SECURITY } from "ts-commons";
import { STATUS_CODES } from "http";
import routes from "./startup/routes";
import { authConfig, environment } from "./config";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger/swagger.json";
import { rateLimit } from "express-rate-limit";
import { CacheTTL } from "./enums";

dotenv.config();

const app: Express = express();

const resolveCrossDomain = function (
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.setHeader("Access-Control-Allow-Origin", environment.allowedOrigins);
  res.header("Access-Control-Allow-Methods", environment.allowedMethods);
  res.header("Access-Control-Allow-Headers", environment.allowedHeaders);
  res.header("Access-Control-Expose-Headers", "Version");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Strict-Transport-Security", "max-age=15552000");
  if ("OPTIONS" == req.method) {
    res.send(STATUS_CODES.OK);
  } else {
    next();
  }
};

const limiter = rateLimit({
  windowMs: CacheTTL.SHORT,
  limit: environment.rateLimit,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// app.enable('trust proxy');
// app.use(limiter);
app.use(
  bodyParser.json({
    limit: environment.bodyParserLimit,
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.set("view engine", "ejs");
app.use(helmet());
app.use(resolveCrossDomain);
app.use(function applyXFrame(req: Request, res: Response, next: NextFunction) {
  res.set("X-Frame-Options", environment.xFrameOptions);
  next();
});

app.use(
  "/api/v1/admin-profile/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile),
);

SECURITY(app, authConfig.AUTH);
routes(app);

process.on("uncaughtException", function (err) {});

const port = environment.port;

app.listen(port, () => {
  logger.info(`app :: Server Started :: Listening to port [${port}]`);
});

export default app;
