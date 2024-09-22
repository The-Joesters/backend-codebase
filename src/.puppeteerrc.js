const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */

const cacheDirectory = join(__dirname, '.cache', 'puppeteer');
console.log(`Puppeteer cache directory is set to: ${cacheDirectory}`);

module.exports = {
    // Changes the cache location for Puppeteer.
    cacheDirectory: cacheDirectory,
};