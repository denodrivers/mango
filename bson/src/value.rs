use bson::Bson;
use wasm_bindgen::JsValue;

use crate::{object, Result};

pub fn inspect(target: &JsValue) -> Result<Bson> {
    if let Some(n) = target.as_f64() {
        return Ok(Bson::Double(n));
    } else if target.is_string() {
        return Ok(Bson::String(target.as_string().unwrap()));
    } else if let Some(b) = target.as_bool() {
        return Ok(Bson::Boolean(b));
    } else if target.is_null() {
        return Ok(Bson::Null);
    } else if target.is_object() {
        return Ok(object::inspect(target)?);
    }
    Err("?".into())
}
