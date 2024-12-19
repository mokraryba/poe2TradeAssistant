use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use reqwest::Method;
use tauri::command;

const PROXY_HOSTS: &[(&str, bool)] = &[
    ("www.pathofexile.com", true),
    ("ru.pathofexile.com", true),
    ("pathofexile.tw", true),
    ("poe.game.daum.net", true),
    ("poe.ninja", false),
    ("www.poeprices.info", false),
];

#[derive(Debug, Serialize)]
pub struct ProxyResponse {
    status: u16,
    headers: HashMap<String, String>,
    body: String,
}

#[derive(Debug, Deserialize)]
pub struct ProxyRequest {
    url: String,
    method: String,
    headers: HashMap<String, String>,
    body: Option<String>,
}

#[command]
pub async fn proxy_request(request: ProxyRequest) -> Result<ProxyResponse, String> {
    let host = request.url
        .split('/')
        .nth(2)
        .ok_or("Invalid URL")?;

    if !PROXY_HOSTS.iter().any(|(h, _)| *h == host) {
        return Err("Unauthorized host".to_string());
    }

    let mut filtered_headers = request.headers;
    filtered_headers.retain(|key, _| {
        !key.starts_with("sec-") && 
        key != "host" && 
        key != "origin" && 
        key != "content-length"
    });

    let method = match request.method.to_uppercase().as_str() {
        "GET" => Method::GET,
        "POST" => Method::POST,
        "PUT" => Method::PUT,
        "DELETE" => Method::DELETE,
        "HEAD" => Method::HEAD,
        "OPTIONS" => Method::OPTIONS,
        "CONNECT" => Method::CONNECT,
        "PATCH" => Method::PATCH,
        "TRACE" => Method::TRACE,
        _ => return Err("Invalid HTTP method".to_string()),
    };

    let client = reqwest::Client::new();
    let mut req_builder = client.request(method, &request.url);

    // Convert HashMap to HeaderMap
    let headers: reqwest::header::HeaderMap = filtered_headers
        .iter()
        .filter_map(|(k, v)| {
            let header_name = reqwest::header::HeaderName::from_bytes(k.as_bytes()).ok()?;
            let header_value = reqwest::header::HeaderValue::from_str(v).ok()?;
            Some((header_name, header_value))
        })
        .collect();

    req_builder = req_builder.headers(headers);

    if let Some(body) = request.body {
        req_builder = req_builder.body(body);
    }

    let response = req_builder
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let status = response.status().as_u16();
    let headers = response
        .headers()
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect();
    let body = response
        .text()
        .await
        .map_err(|e| e.to_string())?;

    Ok(ProxyResponse {
        status,
        headers,
        body,
    })
}
