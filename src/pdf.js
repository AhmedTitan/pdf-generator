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
    console.log({ message: "template compiled" });
    const html = compiledTemplate(data);
    const s3Key = `${fileName}.pdf`;
    console.log({ s3Key });
    puppeteerExtra.use(stealthPlugin());
    console.log({ message: "stealth plugin added" });
    const browser = await puppeteerExtra.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    console.log({ message: "browser created" });
    const page = await browser.newPage();
    console.log({ message: "page created" });
    await page.setContent(html);
    console.log({ message: "page content added" });
    await page.pdf({ path: s3Key, format: "A4" });
    console.log({ message: "page format set to a4" });
    await browser.close();
    console.log({ message: "browser closed" });
    const buffer = fs.readFileSync(s3Key);
    console.log({ message: "file buffer" });
    const file = await s3.uploadFile(s3Key, buffer);
    console.log({ message: "file uploaded" });
    fs.unlinkSync(s3Key);
    return Promise.resolve(file);
  } catch (error) {
    console.log(error);
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
