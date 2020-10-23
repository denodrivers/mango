use wasm_bindgen::JsValue;

use crate::Result;

fn extract_string(target: &JsValue) -> Result<String> {
    target
        .as_string()
        .ok_or_else(|| "failed to extract string value".into())
}

pub(crate) fn long(target: &JsValue) -> Result<i64> {
    let n = extract_string(target)?;
    let n = n
        .parse::<i64>()
        .map_err(|err| format!("error converting $numberLong value: {}", err.to_string()))?;
    Ok(n)
}

pub(crate) fn int(target: &JsValue) -> Result<i32> {
    let n = extract_string(target)?;
    let n = n
        .parse::<i32>()
        .map_err(|err| format!("error converting $numberInt value: {}", err.to_string()))?;
    Ok(n)
}

pub(crate) fn double(target: &JsValue) -> Result<f64> {
    let n = extract_string(target)?;
    match n.as_str() {
        "Infinity" => Ok(f64::INFINITY),
        "-Infinity" => Ok(f64::NEG_INFINITY),
        _ => {
            let n = n.parse::<f64>().map_err(|err| {
                format!("error converting $numberDouble value: {}", err.to_string())
            })?;
            Ok(n)
        }
    }
}
