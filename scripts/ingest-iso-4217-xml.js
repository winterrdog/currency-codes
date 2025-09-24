// @ts-check
import { parseString } from "xml2js";
import { readFile, writeFile } from "node:fs";

const input = "iso-4217-list-one.xml";
const outputDataFile = "data.js";
const outputPublishDateFile = "iso-4217-publish-date.js";

readFile(input, function (err, data) {
  failOnError(err);

  parseString(
    data,
    {
      explicitArray: false, // turn off array wrappers around content
      explicitCharkey: true, // put all content under a key so its easier to parse when there are attributes
      mergeAttrs: true, // lift attributes up so they're easier to parse
    },
    function (err, result) {
      failOnError(err);

      const publishDate = ingestPublishDate(result);
      const countries = ingestEntries(result);

      const preamble =
        "/*\n" +
        "\tFollows ISO 4217, https://www.iso.org/iso-4217-currency-codes.html\n" +
        "\tSee https://www.currency-iso.org/dam/downloads/lists/list_one.xml\n" +
        "\tData last updated " +
        publishDate +
        "\n" +
        "*/\n\n";

      const dataContent =
        preamble +
        "const data = " +
        JSON.stringify(countries, null, "  ") +
        ";\nexport default data;";

      const publishDateContent =
        preamble +
        "const publishDate = " +
        JSON.stringify(publishDate, null, "  ") +
        ";\nexport default publishDate;";

      writeFile(outputDataFile, dataContent, function (err) {
        failOnError(err);

        console.log("Ingested " + input + " into " + outputDataFile);
      });

      writeFile(outputPublishDateFile, publishDateContent, function (err) {
        failOnError(err);

        console.log("Wrote publish date to " + outputPublishDateFile);
      });
    }
  );
});

// ======
// HELPERS
// ======

/* Got from To Title Case © 2018 David Gouch | https://github.com/gouch/to-title-case */
/**
 * @this {any}
 */
function toTitleCase() {
  let smallWords =
      /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i,
    alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/,
    wordSeparators = /([ :–—-])/;

  // @ts-ignore
  return (
    this.split(wordSeparators)
      // @ts-ignore
      .map(function formatTitleCase(current, index, array) {
        if (
          /* Check for small words */
          current.search(smallWords) > -1 &&
          /* Skip first and last word */
          index !== 0 &&
          index !== array.length - 1 &&
          /* Ignore title end and subtitle start */
          array[index - 3] !== ":" &&
          array[index + 1] !== ":" &&
          /* Ignore small words that start a hyphenated phrase */
          (array[index + 1] !== "-" ||
            (array[index - 1] === "-" && array[index + 1] === "-"))
        ) {
          return current.toLowerCase();
        }

        /* Ignore intentional capitalization */
        if (current.substr(1).search(/[A-Z]|\../) > -1) {
          return current;
        }

        /* Ignore URLs */
        if (array[index + 1] === ":" && array[index + 2] !== "") {
          return current;
        }

        /* Capitalize the first letter */
        // @ts-ignore
        return current.replace(alphanumericPattern, function (match) {
          return match.toUpperCase();
        });
      })
      .join("")
  );
}

// @ts-ignore
function ingestEntry(entry) {
  return {
    code: entry.Ccy && entry.Ccy._,
    number: entry.CcyNbr && entry.CcyNbr._,
    digits: (entry.CcyMnrUnts && parseInt(entry.CcyMnrUnts._)) || 0,
    currency: entry.CcyNm && entry.CcyNm._,
    countries:
      (entry.CtryNm &&
        entry.CtryNm._ && [toTitleCase.call(entry.CtryNm._.toLowerCase())]) ||
      [],
  };
}

// @ts-ignore
function indexByCode(index, c) {
  if (!index[c.code]) {
    index[c.code] = c;
  } else {
    index[c.code].countries = index[c.code].countries.concat(c.countries);
  }
  return index;
}

// @ts-ignore
function compareCurrencyCode(a, b) {
  return a.code.localeCompare(b.code);
}

// @ts-ignore
function ingestEntries(data) {
  const currenciesByCode = data.ISO_4217.CcyTbl.CcyNtry.map(ingestEntry).reduce(
    indexByCode,
    {}
  );

  const currencies = Object.values(currenciesByCode).filter(function (c) {
    return !!c.code;
  });
  currencies.sort(compareCurrencyCode);

  return currencies;
}

// @ts-ignore
function ingestPublishDate(data) {
  return data.ISO_4217.Pblshd;
}

// @ts-ignore
function failOnError(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
}
