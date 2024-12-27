export interface ExchangeItem {
	id: string;
	complexity: any;
	total: number;
	result: {
		[key: string]: {
			id: string;
			item: null;
			listing: {
				indexed: string;
				account: {
					name: string;
					online: {
						league: string;
					};
					lastCharacterName: string;
					language: string;
					realm: string;
				};
				offers: Array<{
					exchange: {
						currency: string;
						amount: number;
						whisper: string;
					};
					item: {
						currency: string;
						amount: number;
						stock: number;
						id: string;
						whisper: string;
					};
				}>;
				whisper: string;
				whisper_token: string;
			};
		};
	};
}