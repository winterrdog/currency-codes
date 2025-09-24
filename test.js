import assert from "assert";
import {
  code,
  number,
  country,
  codes,
  countries,
  numbers,
  data,
} from "./index.js";

assert(code("EUR").countries.length === 36);
assert(code("IDR").digits === 2);
assert(number("967").currency === "Zambian Kwacha");
assert(number(967).currency === "Zambian Kwacha");
assert(country("Colombia").length === 2);
assert(country("colombia").length === 2);
assert(codes().length === 179);
assert(countries().length === 261);
assert(numbers().length === 179);
assert(numbers()[0] === "784");
assert(data.length == 179);
