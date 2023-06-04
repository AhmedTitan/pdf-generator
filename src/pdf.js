// import handlebars from "handlebars";
// import s3 from "./s3.js";
// import puppeteer from "puppeteer";
// import fs from "fs";
// import { sendDCMessage } from "./discord.js";

// export const generatePDF = async (data, template, fileName) => {
//   try {
//     const compiledTemplate = handlebars.compile(template);
//     const html = compiledTemplate(data);
//     const s3Key = `${fileName}.pdf`;

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(html);
//     await page.pdf({ path: s3Key, format: "A4" });
//     await browser.close();
//     const buffer = fs.readFileSync(s3Key);
//     const file = await s3.uploadFile(s3Key, buffer);
//     fs.unlinkSync(s3Key);
//     return Promise.resolve(file);
//   } catch (error) {
//     await sendDCMessage(`PDF_GENERATOR_ERROR: ${JSON.stringify({ error })}`);
//     return Promise.reject(error);
//   }
// };

import handlebars from "handlebars";
import pdf from "html-pdf";
import path from "path";
import s3 from "./s3.js";

export const generatePDF = async (data, template, fileName) => {
  return new Promise((resolve, reject) => {
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(data);

    return pdf.create(html).toBuffer(async function (err, buffer) {
      if (err) return reject(err);

      const s3Key = `${fileName}.pdf`;
      const file = await s3.uploadFile(s3Key, buffer);
      return resolve(file);
    });
  });
};
