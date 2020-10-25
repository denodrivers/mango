use wasm_bindgen::prelude::*;

type Result<T> = std::result::Result<T, JsValue>;

mod encoder;

#[wasm_bindgen]
pub fn to_bson_document(target: &JsValue) -> Result<Vec<u8>> {
    if !target.is_object() {
        return Err(js_sys::Error::new("only object can be serialized to bson documents").into());
    }
    let document = encoder::create_document(&target)?;
    let mut buf: Vec<u8> = vec![];
    document.to_writer(&mut buf).map_err(|err| {
        js_sys::Error::new(&format!("error writing document: {}", err.to_string()))
    })?;
    Ok(buf)
}

#[wasm_bindgen]
pub fn from_bson_document(buf: Vec<u8>) -> Result<String> {
    let mut x: &[u8] = &buf;
    let document = bson::Document::from_reader(&mut x).map_err(|err| {
        js_sys::Error::new(&format!("error parsing document: {}", err.to_string()))
    })?;
    Ok(serde_json::to_string(&document).map_err(|err| {
        js_sys::Error::new(&format!(
            "error serializing document to json: {}",
            err.to_string()
        ))
    })?)
}
