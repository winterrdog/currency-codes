// @ts-check
import nub from "./nub.js";
import data from "./data.js";
import publishDate from "./iso-4217-publish-date.js";

const code = function (code) {
  code = code.toUpperCase();
  const matched = data.find(function (c) {
    return c.code === code;
  });
  return matched || null;
};

const country = function (country) {
  country = country.toLowerCase();
  return data.filter(function (c) {
    return (
      (
        c.countries.map(function (c) {
          return c.toLowerCase();
        }) || []
      ).indexOf(country) > -1
    );
  });
};
const number = function (number) {
  const matched = data.find(function (c) {
    return c.number === String(number);
  });
  return matched || null;
};
const codes = function () {
  return data.map(function (c) {
    return c.code;
  });
};
const numbers = function () {
  const items = data.map(function (c) {
    return c.number;
  });

  // handle cases where number is undefined (e.g. XFU and XBT)
  return items.filter(function (n) {
    if (n) {
      return n;
    }
  });
};
const countries = function () {
  const m = data
    .filter(function (c) {
      return c.countries;
    })
    .map(function (c) {
      return c.countries;
    });
  return nub(Array.prototype.concat.apply([], m));
};

const _code = code;
export { _code as code };
const _country = country;
export { _country as country };
const _number = number;
export { _number as number };
const _codes = codes;
export { _codes as codes };
const _numbers = numbers;
export { _numbers as numbers };
const _countries = countries;
export { _countries as countries };
const _publishDate = publishDate;
export { _publishDate as publishDate };
const _data = data;
export { _data as data };
