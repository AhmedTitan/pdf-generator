import handlebars from "handlebars";
import s3 from "./s3.js";
import puppeteer from "puppeteer";
import fs from "fs";
import { sendDCMessage } from "./discord.js";
import chromium from "@sparticuz/chromium";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

export const generatePDF = async (data, template, fileName) => {
  try {
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(data);
    const s3Key = `${fileName}.pdf`;
    puppeteerExtra.use(stealthPlugin());
    const browser = await puppeteerExtra.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: s3Key, format: "A4" });
    await browser.close();
    const buffer = fs.readFileSync(s3Key);
    const file = await s3.uploadFile(s3Key, buffer);
    fs.unlinkSync(s3Key);
    return Promise.resolve(file);
  } catch (error) {
    sendDCMessage(
      `PDF_GENERATOR_ERROR: \`\`\`${JSON.stringify({ error })}\`\`\``
    );
    return Promise.reject(error);
  }
};

// import handlebars from "handlebars";
// import pdf from "html-pdf";
// import path from "path";
// import s3 from "./s3.js";

// export const generatePDF = async (data, template, fileName) => {
//   return new Promise((resolve, reject) => {
//     const compiledTemplate = handlebars.compile(template);
//     const html = compiledTemplate(data);

//     return pdf.create(html).toBuffer(async function (err, buffer) {
//       if (err) return reject(err);

//       const s3Key = `${fileName}.pdf`;
//       const file = await s3.uploadFile(s3Key, buffer);
//       return resolve(file);
//     });
//   });
// };
