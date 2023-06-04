import handlebars from "handlebars";
import s3 from "./s3.js";
import puppeteer from "puppeteer";
import fs from "fs";
import { sendDCMessage } from "./discord.js";

export const generatePDF = async (data, template, fileName) => {
  try {
    sendDCMessage(
      `Executing PDF GENERATOR: ${JSON.stringify({ data, fileName })}`
    );
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(data);
    const s3Key = `${fileName}.pdf`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: s3Key, format: "A4" });
    await browser.close();
    const buffer = fs.readFileSync(s3Key);
    const file = await s3.uploadFile(s3Key, buffer);
    fs.unlinkSync(s3Key);
    return Promise.resolve(file);
  } catch (error) {
    await sendDCMessage(`PDF_GENERATOR_ERROR: ${JSON.stringify({ error })}`);
    return Promise.reject(error);
  }
};
