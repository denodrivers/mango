use bson::{oid::ObjectId, Bson};
use chrono::prelude::*;
use wasm_bindgen::JsValue;

use crate::{number, Result};

// For reference: https://docs.mongodb.com/manual/reference/mongodb-extended-json/

/// `{“$oid”: ”<oid>”}`
/// <oid>: A 24-character, big-endian hexadecimal string that represents the ObjectId bytes.
fn oid(target: &JsValue) -> Result<Bson> {
    let oid = target
        .as_string()
        .ok_or_else(|| "failed to extract object id value")?;
    Ok(Bson::ObjectId(ObjectId::with_string(&oid).map_err(
        |err| format!("error in ObjectID value: {}", err.to_string()),
    )?))
}

/// `{"$date": {"$numberLong": "<millis>"}}`
/// <millis>: A 64-bit signed integer as string. The value represents milliseconds relative to the epoch.
fn date(target: &JsValue) -> Result<Bson> {
    let ms = js_sys::Reflect::get(target, &JsValue::from_str("$numberLong"))?;
    let ms = number::long(&ms)?;
    let secs = ms / 1e3 as i64; // [s]
    let nsecs = ((ms % 1e3 as i64) * 1e6 as i64) as u32; // [ns]
    let date = chrono::Utc.timestamp(secs, nsecs);
    Ok(Bson::DateTime(date))
}

/// {"$timestamp": {"t": <t>, "i": <i>}}
/// <t>: A positive integer for the seconds since epoch.
/// <i>: A positive integer for the increment.
fn timestamp(target: &JsValue) -> Result<Bson> {
    let t = js_sys::Reflect::get(target, &JsValue::from_str("t"))?;
    let i = js_sys::Reflect::get(target, &JsValue::from_str("i"))?;
    let t = t.as_f64().ok_or_else(|| "invalid t in $timestamp")?;
    let i = i.as_f64().ok_or_else(|| "invalid i in $timestamp")?;
    let time = (t / 1e3) as u32; // [s]
    let increment = i as u32;
    Ok(Bson::Timestamp(bson::Timestamp { time, increment }))
}

/// { "$regularExpression": { "pattern": "<regexPattern>", "options": "<options>" } }
/// <regexPattern>: A string that corresponds to the regular expression pattern.
///     The string can contain valid JSON characters and unescaped double quote (") characters,
///     but may not contain unescaped forward slash (/) characters.
/// <options>: A string that specifies BSON regular expression options (‘g’, ‘i’, ‘m’ and ‘s’) or an empty string "".
///     Options other than (‘g’, ‘i’, ‘m’ and ‘s’) will be dropped when converting to this representation.
///     !! The options MUST be in alphabetical order.
fn regex(target: &JsValue) -> Result<Bson> {
    let pattern = js_sys::Reflect::get(target, &JsValue::from_str("pattern"))?;
    let options = js_sys::Reflect::get(target, &JsValue::from_str("options"))?;
    let pattern = pattern
        .as_string()
        .ok_or_else(|| "invalid pattern in $regularExpression")?;
    let options = options
        .as_string()
        .ok_or_else(|| "invalid options in $regularExpression")?;

    // sort options...
    let mut chars = options.chars().collect::<Vec<char>>();
    chars.sort_by(|a, b| a.cmp(b));
    let s = chars.into_iter().collect::<String>();
    let options = String::from(s.trim());

    Ok(Bson::RegularExpression(bson::Regex { pattern, options }))
}

pub fn inspect(target: &JsValue) -> Result<Option<Bson>> {
    // extended JSON check (`$`)
    let keys = js_sys::Reflect::own_keys(target)?;
    let keys = keys.to_vec();
    match keys.get(0) {
        Some(key) => {
            let val = js_sys::Reflect::get(target, &key)?;
            let key = key
                .as_string()
                .ok_or_else(|| "failed to extract object key")?;
            Ok(match key.as_str() {
                "$oid" => Some(oid(&val)?),
                "$date" => Some(date(&val)?),
                "$numberDouble" => Some(Bson::Double(number::double(&val)?)),
                "$numberInt" => Some(Bson::Int32(number::int(&val)?)),
                "$numberLong" => Some(Bson::Int64(number::long(&val)?)),
                "$minKey" => Some(Bson::MinKey),
                "$maxKey" => Some(Bson::MaxKey),
                "$regularExpression" => Some(regex(&val)?),
                "$timestamp" => Some(timestamp(&val)?),
                _ => None,
            })
        }
        None => Ok(None),
    }
}
