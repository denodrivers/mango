# Using the BSON converter

`make`

Or to be smart: `make && deno run --allow-read bson/mod.ts`

# Using Driver Dev Environment

```shell script
$ cd tmp
$ docker-compose up -d
$ deno run -A app.ts
```

Mongo database is seeded with a `profiles` collection, with 3 documents
