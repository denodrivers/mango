use wasm_bindgen::prelude::*;

mod extended;
mod number;
mod object;
mod value;

type Result<T> = std::result::Result<T, JsValue>;

#[wasm_bindgen]
extern "C" {
    // console.log access
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

#[wasm_bindgen]
pub fn to_bson_document(target: &JsValue) -> Result<Vec<u8>> {
    if !target.is_object() {
        return Err("only object can be serialized to bson documents".into());
    }
    let document = object::create_document(&target)?;
    log(&format!("{:?}", document));
    let mut buf: Vec<u8> = vec![];
    document
        .to_writer(&mut buf)
        .map_err(|err| format!("error writing document: {}", err.to_string()))?;
    Ok(buf)
}
