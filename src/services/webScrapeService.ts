import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import fs from 'fs';
import ApiError from "../middlewares/ApiError";

class WebScrape {
  private browser: Promise<Browser>;
  private page: Promise<Page>;
  private fileName: string = `${Date.now()}.txt`;
  private myConsole: Console = new console.Console(fs.createWriteStream(`./Articles/${this.fileName}`));

  constructor() {
    this.browser = this.browserInit();
    this.page = this.pageInit();
  }

  private async browserInit() {
    return await puppeteer.launch();
  }

  private async pageInit() {
    const browser = await this.browser;
    return await browser.newPage();
  }

  async GetArticle(link: string): Promise<{ title: string; author: string; contentFile: string }> {
    try{

      const data = { title: '', author: '', contentFile: '' };
      const browser = await this.browser;
      const page = await this.page;
      
      console.log("test to see it")
      await page.goto(link);
      console.log("test to see it")
      await page.setViewport({ width: 1080, height: 1024 });
      console.log("test to see it")
      data.title = await this.getTitle(page);
      console.log("test to see it")
      data.author = await this.getAuthor(page);
      console.log("test to see it")
      console.log("test to see it")
      data.contentFile = await this.getContent(page);
      console.log("test to see it")
      
      console.log("test to see it")
      await browser.close();
      return data;
    }catch(err){
      throw(new ApiError("Error in the link of Medium",404));
    }
  }

  private async getTitle(page: Page): Promise<string> {
    const textSelector = await page.waitForSelector('[data-testid="storyTitle"]');
    if (textSelector) {
      const fullTitle = await page.evaluate((el) => el.textContent, textSelector);
      return fullTitle || "Title not found";
    } else {
      return "Title not found";
    }
  }

  private async getAuthor(page: Page): Promise<string> {
    const textSelector = await page.waitForSelector('[data-testid="authorName"]');
    const text = await textSelector?.evaluate((e) => e.textContent);
    if (text) {
      return text;
    } else {
      return "Author not found"; // Fallback message
    }
  }

  private async getContent(page: Page): Promise<string> {
    const paragraphs = await page.$$('[data-selectable-paragraph]');
    let content = '';

    if (paragraphs.length > 0) {
      const texts = await Promise.all(
        paragraphs.map(async (p) => {
          return page.evaluate((el) => el.innerHTML, p);
        })
      );

      this.myConsole.log('Paragraphs:\n\n');
      texts.forEach((text) => {
        const re = new RegExp(/<[^>]*>/g);
        content = text.replace(re, "");
        this.myConsole.log(`${content}\n`)
      });
    } else {
      return this.fileName; 
    }

    return this.fileName;
  }
}

export default WebScrape;
