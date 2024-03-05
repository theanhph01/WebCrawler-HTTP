const { JSDOM } = require("jsdom");

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      //relative URL
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error!!! with Invalid Url: ${err.message}`);
      }
    } else {
      //absolute URL
      try {
        const urlObj = new URL(`${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error!!! with Invalid Url: ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const urlHostname = urlObj.hostname;
  const urlPathname = urlObj.pathname;
  const url = urlHostname + urlPathname;
  if (url.length > 0 && url.slice(-1) === "/") {
    return url.slice(0, -1);
  }
  return url;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
};
