import { fetch } from '@tauri-apps/plugin-http'
const POE_API_BASE = 'https://www.pathofexile.com/api/trade2';

export const searchItems = async (sessionId: string, searchParams: any) => {
	// const response = await fetch(`${POE_API_BASE}/search`, {
	const response = await fetch(`https://www.pathofexile.com/trade2/search/poe2/Standard/M4Xaq2JUJ`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Cookie': `POESESSID=${sessionId}`,
		},
		body: JSON.stringify(searchParams)
	});

	console.log(response)
	return await response.json();
};

export const fetchListings = async (sessionId: string, searchId: string, resultIds: string[]) => {
	const response = await fetch(`${POE_API_BASE}/fetch/${resultIds.join(',')}?query=${searchId}`, {
		headers: {
			'Cookie': `POESESSID=${sessionId}`,
		}
	});

	return await response.json();
};
