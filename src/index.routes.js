import express from "express";
import bodyParser from "body-parser";

import controller from "./controller.js";

// Express Router instance
const router = express.Router();

router.use(bodyParser.json({ limit: "50mb" }));
router.use(express.json({ limit: "50mb", extended: true }));
router.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 100000 })
);
router.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
    limit: "50mb",
  })
);
router.use(
  bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);

const maxRequestBodySize = "100mb";
router.use(express.json({ limit: maxRequestBodySize }));
router.use(express.urlencoded({ limit: maxRequestBodySize }));

//Test route to check server status
router.get(`/`, (req, res) => res.send({ server: "PDF server is online" }));

router.post(`/pdf`, controller.generatePdfController);

export default router;
