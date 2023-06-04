import { sendDCMessage } from "./discord.js";
import { generatePDF } from "./pdf.js";
import path from "path";

const generatePdfController = async (req, res) => {
  try {
    const { templateData, fileName } = req.body;
    const currentDir = path.dirname(process.argv[1]);

    sendDCMessage(
      `templateData, fileName: ${JSON.stringify({
        templateData,
        fileName,
      })}`
    );
    console.log({ templateData, fileName });
    console.log(
      "Current directory:",
      path.join(currentDir, "/templates/assetPage.html")
    );
    sendDCMessage(
      `PATH: ${JSON.stringify({
        path: path.join(currentDir, "/templates/assetPage.html"),
      })}`
    );

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

    // await sendDCMessage(
    //   `generatePDF: ${JSON.stringify({
    //     templateData,
    //     path: path.join(__dirname, "../templates/assetPage.html"),
    //     fileName,
    //   })}`
    // );
    await generatePDF(
      templateData,
      path.join(currentDir, "/templates/assetPage.html"),
      fileName
    );
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
