import handlebars from "handlebars";
import s3 from "./s3.js";
import puppeteer from "puppeteer";
import fs from "fs";
import chromium from "@sparticuz/chromium";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

export const generatePDF = async (data, template, fileName) => {
  try {
    const compiledTemplate = handlebars.compile(template);

    const bufferImages = fetchAndConvertImages(data.images);
    data.images = bufferImages;
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
    browser.close();
    await browser.process()?.kill();
    const buffer = fs.readFileSync(s3Key);
    const file = await s3.uploadFile(s3Key, buffer);
    fs.unlinkSync(s3Key);
    return Promise.resolve(file);
  } catch (error) {
    return Promise.reject(error);
  }
};

const fetchAndConvertImages = async (assetImages) => {
  const bufferImagesPromises = assetImages.map(async (image) => {
    const data = await s3.getFile(image.imageKey || "");
    if (data && !isEmpty(data)) {
      return Buffer.from(data.Body).toString("base64");
    }
  });
  const bufferImages = await Promise.all(bufferImagesPromises);
  return bufferImages.filter(Boolean);
};
