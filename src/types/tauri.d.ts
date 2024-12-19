declare module '@tauri-apps/plugin-clipboard-manager' {
	export function readText(): Promise<string>;
	export function writeText(text: string): Promise<void>;
}
