use serde_json::Value;
use wasm_bindgen::prelude::*;

type Result<T> = std::result::Result<T, JsValue>;

#[wasm_bindgen]
pub fn to_bson_document(target: &JsValue) -> Result<Vec<u8>> {
    if let Some(data) = target.as_string() {
        let value: Value = serde_json::from_str(&data)
            .map_err(|err| format!("error deserializing JSON: {}", err.to_string()))?;
        let document = bson::to_document(&value)
            .map_err(|err| format!("error creating BSON document: {}", err.to_string()))?;
        let mut buf: Vec<u8> = vec![];
        document
            .to_writer(&mut buf)
            .map_err(|err| format!("error writing document: {}", err.to_string()))?;
        Ok(buf)
    } else {
        return Err("only JSON strings can be serialized to bson documents".into());
    }
}
