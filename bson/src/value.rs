use bson::Bson;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

use crate::{object, Result};

#[wasm_bindgen(module = "/src/inspect.js")]
extern "C" {
    pub fn inspect(target: &JsValue) -> u32;
}

pub fn transform(target: &JsValue) -> Result<Bson> {
    let type_id = inspect(target);
    match type_id {
        0 => Ok(Bson::Double(target.as_f64().unwrap())),
        1 => Ok(Bson::String(target.as_string().unwrap())),
        2 => Ok(Bson::Boolean(target.as_bool().unwrap())),
        3 => Ok(Bson::Null),
        4..=8 => Ok(object::transform(target, type_id)?),
        _ => Err("type not valid in BSON spec".into()),
    }
}
