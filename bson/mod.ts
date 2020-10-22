import { to_bson_document } from "./build/mango_bson.js";

function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

console.log(
  toHexString(
    to_bson_document({
      date: new Date(),
      array: [1, 2, 3, { date: new Date() }],
      set: new Set([{ date: new Date() }, 4, 5, 6]),
      map: new Map([["123", "3"]])
    })
  )
);
