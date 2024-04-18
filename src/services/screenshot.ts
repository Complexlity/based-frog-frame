import chrome from "@sparticuz/chromium";
import puppeteer, { Page } from "puppeteer-core";

// const getAbsoluteURL = (hash: string, path?: string) => {
//   if (!process.env.NODE_ENV) {
//     return `http://localhost:3000/${hash}`
//   }

//   return `https://image.w.kodadot.xyz/ipfs/${path}/${hash}`
// }

// type ScreenshotRequest = {
// 	url: string
// 	settings?: Settings
// }

// export type Settings = {
// 	delay?: number;
// 	width?: number;
// 	height?: number;
// }

const performCanvasCapture = async (page: Page, canvasSelector: string) => {
  try {
    // get the base64 image from the CANVAS targetted
    const base64 = await page.$eval(canvasSelector, (el) => {
      if (!el || el.tagName !== "CANVAS") return null;
      return "found";
    });
    if (!base64) throw new Error("No canvas found");
    console.log("Screenshotting...");
    const screenshot = await page.screenshot({
      encoding: "base64",
      type: "jpeg",
    });
    console.log("Done screenshotting");
    const dataURL = `data:image/png;base64,${screenshot}`;
    // console.log({ dataURL });

    return dataURL;
    // return Buffer.from(pureBase64, "base64")
  } catch (err) {
    return null;
  }
};

export async function doScreenshot(url: string) {
  const isProd = process.env.NODE_ENV === "production";

  let browser;

  if (isProd) {
    browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: "new",
      ignoreHTTPSErrors: true,
    });
  } else {
    console.log("Launching browser");
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
  }

  const page = await browser.newPage();

  await page.setViewport({ width: 600, height: 600 });

  // const url = getAbsoluteURL(`?hash=${hash}`, path)

  console.log("url", url);

  await page.goto(url);

  const selector = "canvas";

  await page.waitForSelector(selector);

  const element = await performCanvasCapture(page, selector); // const element = page.$(selector)

  // const data = await page.screenshot({
  //   type: 'png'
  // })

  const data = element;

  await browser.close();
  return data;
}
