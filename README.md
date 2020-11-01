<p align="center">
  <img height="200" src="assets/mango.png" alt="Mango Logo">
  <h1 align="center">Mango</h1>
</p>
<p align="center">A MongoDB driver for Deno.</p>
<p align="center">
  <a href="https://github.com/denodrivers/mango/releases">
    <img src="https://img.shields.io/github/release/denodrivers/mango.svg?color=bright_green&label=Tags">
  </a>
  <a href="https://github.com/denodrivers/mango/actions">
    <img src="https://img.shields.io/github/workflow/status/denodrivers/mango/master?label=CI Status">
  </a>
  <a href="https://discord.gg/r5WZ485">
    <img src="https://img.shields.io/badge/chat-on%20discord-blue">
  </a>
  <a href="https://github.com/denodrivers/mango/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/denodrivers/mango">
  </a>
</p>

---

---

> ⚠️ Work in progress. Expect breaking changes.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Features](#features)
- [Maintainers](#maintainers)
- [Other](#other)
  - [Related](#related)
  - [Contribution](#contribution)
  - [Licence](#licence)

## Quick Start

Subject to change, here as a placeholder mainly. In progress

```typescript
import { Mango } from "https://deno.land/x/mango/mod.ts";

const client = new Mango({
  // ... configs
});

const db = await client.connect();

const profileCollection = db.collection("profiles");

const profiles = await profileCollection.find({});
```

## Documentation

In progress

Link to doc.deno.land api documentation, or github pages, or add documentation here

## Features

In progress

- [x] Connecting to the database
- [ ] Find documents for a given collection
- [ ] ...

## Maintainers

- Filippo Rossi ([@qu4k](https://github.com/qu4k))
- Edward Bebbington ([@ebebbington](https://github.com/ebebbington))
- Luca Casonato ([@lucacasonato](https://github.com/lucacasonato))

## Other

### Related

- [bson](https://github.com/mongodb/bson-rust) - rust bson crate

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt` and `cargo fmt` and commit messages are done following Conventional Commits spec.

#### Building BSON converter

The BSON converter is written in Rust, and is run in Deno using WASM. You can compile build the WASM file by running `make` in the `//bson` folder.

You need to have `cargo`, `wasm-bindgen` and the Rust `wasm-unknown-unknown` target installed.

#### Running driver example

```shell
$ docker-compose up -d
$ deno run -A example.ts
```

Mongo database is seeded with a `profiles` collection, with 3 documents.

### Licence

Copyright 2020, the denodrivers team. All rights reserved. MIT license.
