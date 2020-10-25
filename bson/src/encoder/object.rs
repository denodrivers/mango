use bson::{Bson, Document};
use chrono::prelude::*;
use wasm_bindgen::{JsCast, JsValue};

use super::{extended, value};
use crate::Result;

/// Inspect an object JsValue, taking into account default javascript values
pub fn inspect(target: &JsValue) -> Result<Bson> {
    if let Some(date) = target.dyn_ref::<js_sys::Date>() {
        // Date
        let ms: f64 = date.get_time(); // [ms]
        let secs = (ms / 1e3).floor() as i64; // [s]
        let nsecs = ((ms % 1e3) * 1e6).ceil() as u32; // [ns]
        let date = chrono::Utc.timestamp(secs, nsecs);
        return Ok(Bson::DateTime(date));
    } else if let Some(iterable) = target.dyn_ref::<js_sys::Array>() {
        // Array
        let mut array = vec![];
        for x in iterable.iter() {
            array.push(value::inspect(&x)?)
        }
        return Ok(Bson::Array(array));
    } else if let Some(iterable) = target.dyn_ref::<js_sys::Set>() {
        // Set
        let mut array = vec![];
        for x in iterable.keys() {
            let x = x?;
            array.push(value::inspect(&x)?)
        }
        return Ok(Bson::Array(array));
    } else if let Some(map) = target.dyn_ref::<js_sys::Map>() {
        // Map
        let mut document = Document::default();
        for key in map.keys() {
            let key = key?;
            let val = map.get(&key);
            let key = key
                .as_string()
                .ok_or_else(|| "only object can be serialized to bson documents")?;
            document.insert(key, value::inspect(&val)?);
        }
        return Ok(Bson::Document(document));
    } else if let Some(ext) = extended::inspect(target)? {
        // { $type: ... } objects
        return Ok(ext);
    }

    // Plain JS object
    return Ok(Bson::Document(create_document(target)?));
}

// Create a BSON decument from a pure javascript object
pub fn create_document(target: &JsValue) -> Result<Document> {
    let mut document = Document::default();
    let keys = js_sys::Reflect::own_keys(target)?;
    for key in keys.iter() {
        let val = js_sys::Reflect::get(target, &key)?;
        let key = key
            .as_string()
            .ok_or_else(|| "failed to extract object key")?;
        document.insert(key, value::inspect(&val)?);
    }
    Ok(document)
}
