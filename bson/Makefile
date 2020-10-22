BUILD=build
CRATE=mango_bson

all: generate

generate: build
	wasm-bindgen --target deno \
    	--out-dir "$(BUILD)" \
		"./target/wasm32-unknown-unknown/release/$(CRATE).wasm"

build: prepare
	cargo build --release --target wasm32-unknown-unknown

prepare:
	mkdir -p $(BUILD)

clean:
	rm -rf $(BUILD)

.PHONY: all generate build prepare
