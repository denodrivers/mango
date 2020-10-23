use bson::{Bson, Document};
use chrono::prelude::*;
use wasm_bindgen::{JsCast, JsValue};

use crate::{extended, value, Result};

// DONE:
// Double(f64),
// String(String),
// Document(Document),
// Boolean(bool),
// Null,
// DateTime(chrono::DateTime<Utc>),
// Array(Array),
// ObjectId(oid::ObjectId),
// Int32(i32),
// Int64(i64),
// RegularExpression(Regex),
// Timestamp(Timestamp),
// MaxKey,
// MinKey,
// Binary(Binary),

// TODO:
// JavaScriptCode(String),
// JavaScriptCodeWithScope(JavaScriptCodeWithScope),
// Decimal128(Decimal128), // Not working in wasm...

// TODO: prevent infinite recursion

pub fn transform(target: &JsValue, type_id: u32) -> Result<Bson> {
    match type_id {
        4 => {
            // Array
            let iterable = target.dyn_ref::<js_sys::Array>().unwrap();
            let mut array = vec![];
            for x in iterable.iter() {
                array.push(value::transform(&x)?)
            }
            Ok(Bson::Array(array))
        }
        5 => {
            // Date
            let date = target.dyn_ref::<js_sys::Date>().unwrap();
            let ms: f64 = date.get_time(); // [ms]
            let secs = (ms / 1e3).floor() as i64; // [s]
            let nsecs = ((ms % 1e3) * 1e6).ceil() as u32; // [ns]
            let date = chrono::Utc.timestamp(secs, nsecs);
            Ok(Bson::DateTime(date))
        }
        6 => {
            // Set
            let iterable = target.dyn_ref::<js_sys::Set>().unwrap();
            let mut array = vec![];
            for x in iterable.keys() {
                let x = x?;
                array.push(value::transform(&x)?)
            }
            Ok(Bson::Array(array))
        }
        7 => {
            // Map
            let map = target.dyn_ref::<js_sys::Map>().unwrap();
            let mut document = Document::default();
            for key in map.keys() {
                let key = key?;
                let val = map.get(&key);
                let key = key
                    .as_string()
                    .ok_or_else(|| "only object can be serialized to bson documents")?;
                document.insert(key, value::transform(&val)?);
            }
            Ok(Bson::Document(document))
        }
        8 => {
            if let Some(ext) = extended::transform(target)? {
                // { $type: ... } objects
                Ok(ext)
            } else {
                // Plain JS object
                Ok(Bson::Document(create_document(target)?))
            }
        }
        _ => Err("type not valid in BSON spec".into()),
    }
}

pub fn create_document(target: &JsValue) -> Result<Document> {
    let mut document = Document::default();
    let keys = js_sys::Reflect::own_keys(target)?;
    for key in keys.iter() {
        let val = js_sys::Reflect::get(target, &key)?;
        let key = key
            .as_string()
            .ok_or_else(|| "failed to extract object key")?;
        document.insert(key, value::transform(&val)?);
    }
    Ok(document)
}
