import express from "express";

import controller from "./controller.js";

// Express Router instance
const router = express.Router();

//Test route to check server status
router.get(`/`, (req, res) => res.send({ server: "PDF server is online" }));

router.post(`/pdf`, controller.generatePdfController);

export default router;
