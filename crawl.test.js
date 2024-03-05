const { normalizeURL, getURLsFromHTML } = require("./crawl");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://BLOG.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip http", () => {
  const input = "http://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
}); 

test("getURLsFromHTML absolute", () => {
  const inputHTML = `
    <html> 
      <body>
        <a href="https://blog.boot.dev/path/">
          Boot.dev Blog
        </a>
        <a href="https://google.com/">
          Boot.dev Blog
        </a>
      </body>
    </htm>
    `;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTML, inputBaseUrl);
  const expected = ["https://blog.boot.dev/path/", "https://google.com/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
  const inputHTML = `
    <html> 
      <body>
        <a href="/path/">
          Boot.dev Blog
        </a>
      </body>
    </htm>
    `;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTML, inputBaseUrl);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both links", () => {
  const inputHTML = `
    <html> 
      <body>
        <a href="https://blog.boot.dev/path1/">
          Boot.dev Blog Path 1
        </a>
        <a href="https://google.com/">
          Boot.dev Blog
        </a>
        <a href="https://blog.boot.dev/path2/">
          Boot.dev Blog Path 2
        </a>
      </body>
    </htm>
    `;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTML, inputBaseUrl);
  const expected = ["https://blog.boot.dev/path1/", "https://google.com/", "https://blog.boot.dev/path2/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML invalid", () => {
  const inputHTML = `
    <html> 
      <body>
        <a href="invalid">
          Invalid Link
        </a>
      </body>
    </htm>
    `;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTML, inputBaseUrl);
  const expected = [];
  expect(actual).toEqual(expected);
});