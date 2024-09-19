import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import fs from 'fs';




class WebScrape {
  private browser: Promise<Browser>;
  private page: Promise<Page>;
  private fileName:string=`${Date.now()}.txt`;
  private myConsole:Console = new console.Console(fs.createWriteStream(`./Articles/${this.fileName}`));

  constructor() {
    // Constructor initializes the browser and page
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

  async GetArticle(link: string): Promise<string> {
    const browser = await this.browser;
    const page = await this.page;
    await page.goto(link);
    await page!.setViewport({ width: 1080, height: 1024 });

    await this.getTitle(page);
    await this.getAuthor(page);
    await this.getContent(page);
    // Type into search box.

    await browser.close();
    return await  this.fileName;
  }

  async getTitle(page: Page) {
    const textSelector = await page.waitForSelector('[data-testid="storyTitle"]');
    if (textSelector) {
      const fullTitle = await page.evaluate((el) => el.textContent, textSelector);
      this.myConsole.log('Title: "%s".', fullTitle);
    } else {
      this.myConsole.error("Title not found");
    }

  }
  async getAuthor(page: Page) {
    const textSelector = await page.waitForSelector('[data-testid="authorName"]');
    const text = await textSelector?.evaluate((e) => e.textContent);
    if (textSelector) {
      this.myConsole.log("Author:'%s' \n", text);
    } else {
      this.myConsole.error("error while getting textselector");
    }
  }

  async getContent(page: Page) {
    const paragraphs = await page.$$('[data-selectable-paragraph]'); // $$ selects all matching elements

    if (paragraphs.length > 0) {
      const texts = await Promise.all(
        paragraphs.map(async (p) => {
          return page.evaluate((el) => el.innerHTML, p); // Get innerHTML for each paragraph
        })
      );

      this.myConsole.log('Paragraphs:\n\n');
      texts.forEach((text, index) => {
        const re = new RegExp(/<[^>]*>/g)
        text = text.replace(re, "")
        this.myConsole.log(`${text}\n`);
      });
    } else {
      this.myConsole.log("No paragraphs found with the specified attribute.");
    }
  }


}

export default new WebScrape();