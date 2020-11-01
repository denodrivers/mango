import { connect } from "./mod.ts";

const client = await connect("mongodb://localhost:27017");
console.log("Connected");

const db = client.database("juanportal");
const profiles = db.collection("profiles");

for await (const doc of profiles.find({ name: "Edward Bebbington" })) {
  console.log(doc);
}

client.close();
console.log("Closed");
