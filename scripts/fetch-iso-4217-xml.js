// @ts-check

import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";

downloadIso();

// ===============
// IMPLEMENTATION
// ===============

async function downloadIso() {
  var path = "iso-4217-list-one.xml";
  var url =
    "https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml";

  try {
    await fetchAndSaveCurrencyInfo(url, path);
    console.log("Downloaded " + url + " to " + path);
  } catch (e) {
    console.error("Error downloading " + url);
    console.error(e);
    process.exit(1);
  }

  // =======
  // HELPERS
  // =======

  // @ts-ignore
  async function fetchAndSaveCurrencyInfo(url, path) {
    return fetch(url).then(async function processFetchResponse(response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        // send the response body to the file
        const writer = createWriteStream(path);
        // @ts-ignore
        const readable = Readable.fromWeb(response.body);
        readable.pipe(writer);

        await new Promise(function (resolve, reject) {
          // @ts-ignore
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      }
    });
  }
}
