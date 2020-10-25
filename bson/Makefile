BUILD=build
CRATE=mango_bson

WASM=wasm

all: generate

generate: build
	wasm-bindgen --target deno \
    	--out-dir "$(BUILD)" \
		"./target/wasm32-unknown-unknown/release/$(CRATE).wasm"
	deno run --allow-read --allow-write scripts/generate.ts

build: prepare
	cargo build --release --target wasm32-unknown-unknown

prepare:
	mkdir -p $(BUILD)
	mkdir -p $(WASM)

clean:
	rm -rf $(BUILD)
	rm -rf $(WASM)

.PHONY: all generate build prepare
