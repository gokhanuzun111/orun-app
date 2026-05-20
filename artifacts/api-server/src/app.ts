import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import legalRouter from "./routes/legal";
import { logger } from "./lib/logger";

const app: Express = express();

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

if (IS_PRODUCTION && ALLOWED_ORIGINS.length === 0) {
  throw new Error(
    "CORS_ORIGINS environment variable is required in production (comma-separated allowed origins).",
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      if (
        !IS_PRODUCTION &&
        (origin.endsWith(".replit.dev") ||
          origin.endsWith(".expo.dev") ||
          origin.endsWith(".sisko.replit.dev"))
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS engeli: izin verilmeyen kaynak"));
    },
    credentials: true,
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/legal", legalRouter);

export default app;
