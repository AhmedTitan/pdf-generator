import { sendDCMessage } from "./discord.js";
import { generatePDF } from "./pdf.js";
import path from "path";
import fs from "fs";

const generatePdfController = async (req, res) => {
  try {
    const { templateData, fileName } = req.body;
    const currentDir = path.dirname(process.argv[1]);

    if (!templateData) {
      sendDCMessage(
        `PDF_ERROR: Missing template Data: ${JSON.stringify({
          templateData,
          fileName,
        })}`
      );
      return res.status(400).send({
        success: false,
        message: "Missing template Data",
      });
    }

    if (!fileName) {
      sendDCMessage(
        `PDF_ERROR: Missing file name: ${JSON.stringify({
          templateData,
          fileName,
        })}`
      );
      return res.status(400).send({
        success: false,
        message: "Missing file name",
      });
    }

    const dirPath = path.join(currentDir, "/templates/assetPage.html");
    sendDCMessage(`${JSON.stringify({ dirPath })}`);
    console.log({ dirPath });
    const template = fs.readFileSync(dirPath, "utf8");
    sendDCMessage(`${JSON.stringify({ template })}`);
    console.log({ template });
    await generatePDF(templateData, template, fileName);
    res.status(200).json({
      success: true,
      message: `The PDF for file "${fileName}" has been successfully generated.`,
    });
  } catch (error) {
    sendDCMessage(`PDF_ERROR 500: ${JSON.stringify({ error })}`);
    res.status(error.status || 500).send({
      success: false,
      message: error.message || "something went wrong!",
    });
  }
};

export default { generatePdfController };
