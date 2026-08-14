import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { routes } from "./routes/index.ts";

export const app = express();

// FRONTEND_URL accepts a comma-separated list so both "localhost" and
// "127.0.0.1" can be allowed at once — browsers treat them as different
// origins even when they point at the same machine/port, which otherwise
// causes CORS to silently reject requests depending on which hostname the
// frontend happens to be opened with.
const allowedOrigins = (process.env["FRONTEND_URL"] ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origem "${origin}" não permitida por CORS.`));
    },
  }),
);
app.use(express.json());
app.get("/", (_req, res) => res.redirect("/api-docs"));
app.use(routes);
app.use(errorHandler);
