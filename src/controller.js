import { sendDCMessage } from "./discord.js";
import { generatePDF } from "./pdf.js";
import path from "path";

const generatePdfController = async (req, res) => {
  try {
    const { templateData, fileName } = req.body;

    if (!templateData) {
      await sendDCMessage(
        `Missing template Data: ${JSON.stringify({ templateData, fileName })}`
      );
      return res.status(400).send({
        success: false,
        message: "Missing template Data",
      });
    }

    if (!fileName) {
      await sendDCMessage(
        `Missing file name: ${JSON.stringify({ templateData, fileName })}`
      );
      return res.status(400).send({
        success: false,
        message: "Missing file name",
      });
    }

    await generatePDF(
      templateData,
      path.join(__dirname, "../templates/assetPage.html"),
      fileName
    );
    res.status(200).json({
      success: true,
      message: `The PDF for file "${fileName}" has been successfully generated.`,
    });
  } catch (error) {
    await sendDCMessage(`Missing file name: ${JSON.stringify({ error })}`);
    res.status(error.status || 500).send({
      success: false,
      message: error.message || "something went wrong!",
    });
  }
};

export default { generatePdfController };
