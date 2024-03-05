const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  console.log(`actively crawling: ${currentURL}`);
  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(
        `Error in Fetch with status code: ${resp.status} on page ${currentURL}`
      );
      return pages;
    }
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `Non HTML, content-type: ${resp.headers.get(
          "content-type"
        )} on page ${currentURL}`
      );
      return pages;
    }

    const htmlBody = await resp.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (err) {
    console.log(`Error in Fetch API: ${err.message}, on page: ${currentURL}`);
  }
  return pages;
}

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
  crawlPage,
};
