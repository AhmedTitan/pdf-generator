import "dotenv/config";
import "colors";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import indexRouter from "./src/index.routes.js";

//Express instance
const app = express();

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 500000 })
);

//All available routes
app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send("Not found");
});

//Server starting point
app.listen(process.env.PORT, () =>
  console.log(
    `Stack Track Server listening on port ${process.env.PORT}! Environment : ${process.env.NODE_ENV}`
      .cyan.bold
  )
);

export default app;
