import express from "express";
import bodyParser from "body-parser";

import controller from "./controller.js";

// Express Router instance
const router = express.Router();

router.use(bodyParser.json({ limit: "50mb", type: "application/json" }));

//Test route to check server status
router.get(`/`, (req, res) => res.send({ server: "PDF server is online" }));

router.post(`/pdf`, controller.generatePdfController);

export default router;
