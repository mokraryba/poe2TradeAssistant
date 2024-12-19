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


			let registered = await isRegistered("CommandOrControl+D");

			if (registered) {
				await unregister("CommandOrControl+D");
			}

			const regist = await register('CommandOrControl+D', async (event) => {
				if (event.state != "Released") return
				// Simulate Ctrl+C by reading current selection

				console.log(1, "sending copy command")
				await invoke('send_copy_command');
				console.log(2, "   copy sent")


				console.log(3, "getting window")
				let foundWindow = await WebviewWindow.getByLabel("price-check")
				console.log(4, "   got window")
				if (foundWindow) {
					console.log(5, "should close")
					foundWindow.close();
					console.log(6, "   closed")
				}

				await new Promise(resolve => setTimeout(resolve, 200));


				console.log(7, "reading clipboard")
				const clipboardContent = await readText();
				console.log(8, "   read clipboard")
				console.log(clipboardContent);
				let cursorPosition = await window.cursorPosition()

				await invoke('clear_clipboard');

				const monitor = await currentMonitor()

				const maxX = monitor!.size.width - 600; // 600 is window width
				const maxY = monitor!.size.height - 650; // 600 is window height

				// Clamp cursor position within screen bounds
				const boundedX = Math.min(Math.max(0, cursorPosition.x), maxX);
				const boundedY = Math.min(Math.max(0, cursorPosition.y), maxY);


				// Create new window with the item data
				console.log(9, "creating window")
				const priceCheckWindow = new WebviewWindow('price-check', {
					title: 'PoE Price Check',
					width: 600,
					height: 600,
					decorations: false,
					transparent: true,
					alwaysOnTop: true,
					resizable: false,
					url: "/price-check",
					focus: true,
					x: boundedX,
					y: boundedY
				});

				priceCheckWindow.setPosition(new LogicalPosition(boundedX, boundedY))

				console.log(10, "   created window")


				priceCheckWindow.once('tauri://error', async (e) => {
					// an error happened creating the window
					console.log(e)
				});

				// Send clipboard data to the new window
				// priceCheckWindow.once('tauri://created', async (ev) => {
				// 	// Wait for window to be ready
				// 	console.log(11, "created window 2")
				// 	await priceCheckWindow.listen('ready', async () => {
				// 		await priceCheckWindow.emit('item-data', clipboardContent);
				// 	});
				// });

				console.log(12, "sending item data")
				await new Promise(resolve => setTimeout(resolve, 400));
				if (await priceCheckWindow.isEnabled()) {

					await priceCheckWindow.emit('item-data', clipboardContent);
					await priceCheckWindow.setFocus()
				}

			});

			return regist
		} catch (err) {
			console.log(err)
		}
	};

	const unregisterHotkeys = async () => {
		let registered = await isRegistered("CommandOrControl+D");
		if (registered)
			await unregister("CommandOrControl+D");
	}

	return { registerHotkeys, unregisterHotkeys };
};
