import { encode } from "./bson/mod.ts";

console.log(encode({
  hello: "world"
}))
