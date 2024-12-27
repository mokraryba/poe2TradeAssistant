import { register, unregister, isRegistered } from '@tauri-apps/plugin-global-shortcut';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { invoke } from '@tauri-apps/api/core';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { window } from '@tauri-apps/api'
import { LogicalPosition } from '@tauri-apps/api/dpi';
import { currentMonitor } from '@tauri-apps/api/window';


export const useHotkeys = () => {
	const registerHotkeys = async () => {


		try {
			// Set up an interval to check active window
			setInterval(async () => {
				const isPoeActive = await invoke('is_poe_active');

				if (isPoeActive) {
					if (!(await isRegistered("CommandOrControl+D"))) {
						console.log("[DEV]", "Registering hotkey")
						await register('CommandOrControl+D', handleHotkeyPress);
					}
				} else {
					if (await isRegistered("CommandOrControl+D")) {
						console.log("[DEV]", "Unregistering hotkey")
						await unregister("CommandOrControl+D");
					}
				}
			}, 1000); // Check every second

			return true;
		} catch (err) {
			console.log(err)
		}


		async function handleHotkeyPress(event: any) {
			if (event.state != "Released") return
			// Simulate Ctrl+C by reading current selection

			await invoke('send_copy_command');


			let foundWindow = await WebviewWindow.getByLabel("price-check")
			if (foundWindow) {
				foundWindow.close();
			}

			await new Promise(resolve => setTimeout(resolve, 200));


			const clipboardContent = await readText();
			let cursorPosition = await window.cursorPosition()

			await invoke('clear_clipboard');

			const monitor = await currentMonitor()

			const maxX = monitor!.size.width - 600; // 600 is window width
			const maxY = monitor!.size.height - 650; // 600 is window height

			// Clamp cursor position within screen bounds
			const boundedX = Math.min(Math.max(0, cursorPosition.x), maxX);
			const boundedY = Math.min(Math.max(0, cursorPosition.y), maxY);


			// Create new window with the item data
			const priceCheckWindow = new WebviewWindow('price-check', {
				title: 'PoE Price Check',
				width: 600,
				height: 600,
				decorations: false,
				transparent: true,
				alwaysOnTop: true,
				resizable: false,
				shadow: false,
				url: "/price-check",
				focus: true,
				x: boundedX,
				y: boundedY
			});

			priceCheckWindow.setPosition(new LogicalPosition(boundedX, boundedY))


			priceCheckWindow.once('tauri://error', async (e) => {
				console.log(e)
			});

			await new Promise(resolve => setTimeout(resolve, 400));
			if (await priceCheckWindow.isEnabled()) {

				await priceCheckWindow.emit('item-data', clipboardContent);
				await priceCheckWindow.setFocus()
			}
		}

	};

	const unregisterHotkeys = async () => {
		let registered = await isRegistered("CommandOrControl+D");
		if (registered)
			await unregister("CommandOrControl+D");
	}

	return { registerHotkeys, unregisterHotkeys };
};
