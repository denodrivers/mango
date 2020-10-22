use bson::{Bson, Document};
use chrono::prelude::*;
use wasm_bindgen::{prelude::*, JsCast, JsValue};

#[wasm_bindgen]
extern "C" {
    // console.log access
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// DONE:
// Double(f64),
// String(String),
// Document(Document),
// Boolean(bool),
// Null,
// DateTime(chrono::DateTime<Utc>),

// TODO:
// Array(Array),
// RegularExpression(Regex),
// JavaScriptCode(String),
// JavaScriptCodeWithScope(JavaScriptCodeWithScope),
// Int32(i32),
// Int64(i64),
// Timestamp(Timestamp),
// Binary(Binary),
// ObjectId(oid::ObjectId),
// Decimal128(Decimal128),
// MaxKey,
// MinKey,

// TODO: prevent infinite recursion

fn inspect_object(target: &JsValue) -> Result<Bson, JsValue> {
    // TODO: check if array
    if let Some(date) = target.dyn_ref::<js_sys::Date>() {
        // DATE
        let time: f64 = date.get_time(); // [ms]
        let secs = (time / 1e3).floor() as i64; // [s]
        let nsecs = ((time % 1e3) * 1e6).ceil() as u32; // [ns]
        let date = chrono::Utc.timestamp(secs, nsecs);
        return Ok(Bson::DateTime(date));
    } else if let Some(iterable) = target.dyn_ref::<js_sys::Array>() {
        // ARRAY
        let mut array = vec![];
        for x in iterable.iter() {
            array.push(inspect_value(&x)?)
        }
        return Ok(Bson::Array(array));
    } else if let Some(iterable) = target.dyn_ref::<js_sys::Set>() {
        // ARRAY (set)
        let mut array = vec![];
        for x in iterable.keys() {
            let x = x?;
            array.push(inspect_value(&x)?)
        }
        return Ok(Bson::Array(array));
    } else if let Some(map) = target.dyn_ref::<js_sys::Map>() {
        // OBJECT (map)
        let mut document = Document::default();
        for key in map.keys() {
            let key = key?;
            let val = map.get(&key);
            let key = key
                .as_string()
                .ok_or_else(|| JsValue::from("only object can be serialized to bson documents"))?;
            document.insert(key, inspect_value(&val)?);
        }
        return Ok(Bson::Document(document));
    }

    // Plain JS object
    return Ok(Bson::Document(create_document(target)?));
}

fn inspect_value(target: &JsValue) -> Result<Bson, JsValue> {
    log(&format!("{:?}", target));
    if let Some(n) = target.as_f64() {
        // TODO: check other `number types` types
        return Ok(Bson::Double(n));
    } else if target.is_string() {
        return Ok(Bson::String(target.as_string().unwrap()));
    } else if let Some(b) = target.as_bool() {
        return Ok(Bson::Boolean(b));
    } else if target.is_null() {
        return Ok(Bson::Null);
    } else if target.is_object() {
        return Ok(inspect_object(target)?);
    }
    Err("?".into())
}

fn create_document(target: &JsValue) -> Result<Document, JsValue> {
    let mut document = Document::default();
    let keys = js_sys::Reflect::own_keys(target)?;
    for key in keys.iter() {
        let val = js_sys::Reflect::get(target, &key)?;
        let key = key
            .as_string()
            .ok_or_else(|| JsValue::from("only object can be serialized to bson documents"))?;
        document.insert(key, inspect_value(&val)?);
    }
    Ok(document)
}

#[wasm_bindgen]
pub fn to_bson_document(target: &JsValue) -> Result<Vec<u8>, JsValue> {
    if !target.is_object() {
        return Err("only object can be serialized to bson documents".into());
    }
    let document = create_document(&target)?;
    log(&format!("{:?}", document));
    let mut buf: Vec<u8> = vec![];
    document
        .to_writer(&mut buf)
        .map_err(|err| err.to_string())?;
    Ok(buf)
}
