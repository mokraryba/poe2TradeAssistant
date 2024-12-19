import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';

export const useClipboard = () => {
	const readClipboard = async () => {
		try {
			const text = await readText();
			return text;
		} catch (error) {
			console.error('Failed to read clipboard:', error);
			return null;
		}
	};

	const writeClipboard = async (text: string) => {
		try {
			await writeText(text);
			return true;
		} catch (error) {
			console.error('Failed to write to clipboard:', error);
			return false;
		}
	};

	return { readClipboard, writeClipboard };
};