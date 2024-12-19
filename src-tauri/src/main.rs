// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod proxy;

use proxy::proxy_request;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![send_copy_command, clear_clipboard, proxy_request])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


use windows::Win32::UI::Input::KeyboardAndMouse::{
    INPUT, INPUT_0, INPUT_KEYBOARD, KEYBDINPUT, SendInput, 
    VIRTUAL_KEY, KEYBD_EVENT_FLAGS
};



#[tauri::command]
fn send_copy_command() {
    unsafe {
        let mut inputs = vec![
            // Press CTRL
            INPUT {
                r#type: INPUT_KEYBOARD,
                Anonymous: INPUT_0 {
                    ki: KEYBDINPUT {
                        wVk: VIRTUAL_KEY(0x11), // VK_CONTROL
                        wScan: 0,
                        dwFlags: KEYBD_EVENT_FLAGS(0),
                        time: 0,
                        dwExtraInfo: 0,
                    },
                },
            },
            // Press C
            INPUT {
                r#type: INPUT_KEYBOARD,
                Anonymous: INPUT_0 {
                    ki: KEYBDINPUT {
                        wVk: VIRTUAL_KEY(0x43), // VK_C
                        wScan: 0,
                        dwFlags: KEYBD_EVENT_FLAGS(0),
                        time: 0,
                        dwExtraInfo: 0,
                    },
                },
            },
            // Release C
            INPUT {
                r#type: INPUT_KEYBOARD,
                Anonymous: INPUT_0 {
                    ki: KEYBDINPUT {
                        wVk: VIRTUAL_KEY(0x43), // VK_C
                        wScan: 0,
                        dwFlags: KEYBD_EVENT_FLAGS(2), // KEYEVENTF_KEYUP
                        time: 0,
                        dwExtraInfo: 0,
                    },
                },
            },
            // Release CTRL
            INPUT {
                r#type: INPUT_KEYBOARD,
                Anonymous: INPUT_0 {
                    ki: KEYBDINPUT {
                        wVk: VIRTUAL_KEY(0x11), // VK_CONTROL
                        wScan: 0,
                        dwFlags: KEYBD_EVENT_FLAGS(2), // KEYEVENTF_KEYUP
                        time: 0,
                        dwExtraInfo: 0,
                    },
                },
            },
        ];
        SendInput(&mut inputs, std::mem::size_of::<INPUT>() as i32);
    }
}

use windows::Win32::System::DataExchange::{OpenClipboard, EmptyClipboard, CloseClipboard};

#[tauri::command]
fn clear_clipboard() {
    unsafe {
        OpenClipboard(None);
        EmptyClipboard();
        CloseClipboard();
    }
}
