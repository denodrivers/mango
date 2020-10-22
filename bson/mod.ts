import { to_bson_document } from "./build/mango_bson.js";

function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

console.log(toHexString(to_bson_document({ hello: new Date() })));
