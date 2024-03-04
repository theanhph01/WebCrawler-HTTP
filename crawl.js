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
};
