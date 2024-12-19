import { invoke } from '@tauri-apps/api/core';
import { TradeItem } from '../types/items';

export interface SearchResult {
	id: string;
	result: string[];
	total: number;
}

export interface FetchItemsResult {
	result: Array<{
		id: string;
		listing: {
			price: {
				amount: number;
				currency: string;
			};
		};
		item: {
			name: string;
			typeLine: string;
			// Add more item properties as needed
		};
	}>;
}

export async function searchItems(query: any): Promise<SearchResult> {
	return await fetchFromPoe('/api/trade2/search/Standard', {
		method: 'POST',
		body: query,
	});
}

export async function fetchItems(itemIds: string[]): Promise<TradeItem[]> {
	const ids = itemIds.join(',');
	let data = await fetchFromPoe<any>(`/api/trade2/fetch/${ids}`);
	return data?.result
}

async function fetchFromPoe<T>(path: string, options: RequestInit = {}): Promise<T> {
	const response = await invoke<any>('proxy_request', {
		request: {
			url: `https://www.pathofexile.com${path}`,
			method: options.method || 'GET',
			headers: {
				'User-Agent': 'PoE Trade Client/2.0',
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: options.body ? JSON.stringify(options.body) : undefined,
		},
	});

	if (response.status >= 400) {
		throw new Error(`PoE API error: ${response.status}`);
	}

	return JSON.parse(response.body);
}
