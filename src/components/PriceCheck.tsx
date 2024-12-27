import { useEffect, useState } from 'react';
import { Window } from '@tauri-apps/api/window';
import { ParsedItem, parseFullItem } from '../hooks/useItemParse';
import { fetchItems, searchBulkItems, searchItems } from '../lib/proxy';
import { buildSearchQuery } from '../lib/searchBuilder';
import { TradeItem } from '../types/items';
import currency from '../data/currency.json'
import { ExchangeItem } from '../types/exchangeItems';
import DisplayBulkItems from './DisplayBulkItems';
import DisplayTradeitems from './DisplayTradeitems';

export interface SelectedMod {
	value: number;
	text: string;
	checked: boolean
	id: string;
}

export default function PriceCheck() {
	const [itemData, setItemData] = useState<ParsedItem>(
		{
			base: "Staff",
			itemLevel: 30,
			mods: [{ id: "asd", raw: "asd", value: 1, text: "asd" }],
			name: "asd",
			rarity: "Unique",
			type: "asd"
		}
	)

	const [tradeItems, setTradeItems] = useState<TradeItem[]>([]);
	const [tradeBulkItems, setTradeBulkItems] = useState<ExchangeItem>();
	const [searchItemsData, setSearchItemsData] = useState<any>({
		id: "",
		result: [],
		total: 0,
		current: 0
	});
	const [selectedMods, setSelectedMods] = useState<SelectedMod[]>([])

	// useEffect(() => {
	// 	const onBlur = () => {
	// 		let window = Window.getCurrent();
	// 		window.close();
	// 	}
	// 	window.addEventListener("blur", onBlur)

	// 	return () => {
	// 		window.removeEventListener("blur", onBlur)
	// 	}
	// }, []);

	useEffect(() => {
		try {
			const window = Window.getCurrent();
			window.emit('ready');

			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					window.close();
				}
			};


			// Listen for item data
			window.listen('item-data', (event: any) => {
				console.log("item data")
				let itm = parseFullItem(event.payload)
				console.log({ itm })
				setItemData(itm)

				setSelectedMods(itm.mods.map(mod => ({ text: mod.raw, id: mod.id, value: mod.value, checked: false })))

				console.log(itm)
				// Here you'll add logic to parse PoE item data and fetch prices
			});
			document.addEventListener('keydown', handleKeyDown);
		} catch (err) {
			console.log(err)
		}

		window.focus()

		return () => {
			// document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (!itemData) return;
		console.log({ itemData })
		setSelectedMods(itemData.mods.map(mod => ({ text: mod.raw, id: mod.id, value: mod.value, checked: false })))
		if (itemData.type == "currency") {
			searchBulk(itemData.name)
		}
	}, [itemData])

	const handleModChange = (mod: SelectedMod, value: string) => {
		const newSelectedMods = [...selectedMods];
		newSelectedMods[selectedMods.findIndex(m => m.text == mod.text)].value = parseInt(value) || 0
		setSelectedMods(newSelectedMods);
		console.log(newSelectedMods)
	}

	const displayMods = () => {
		return selectedMods.map((mod, index) => (
			<div key={index} className="flex items-center gap-1">
				<input
					type="checkbox"
					checked={mod.checked}
					onChange={() => {
						const newSelectedMods = [...selectedMods];
						newSelectedMods[index].checked = !newSelectedMods[index].checked;
						setSelectedMods(newSelectedMods);
					}}
					className="mr-2"
				/>
				<input min={0} onChange={ev => handleModChange(mod, ev.target.value)} className='text-white bg-slate-700 p-1 w-14 rounded-md text-center' type="number" value={mod.value} />
				<span>{mod.text}</span>
			</div>
		));
	}

	const searchBulk = async (name: string) => {
		let foundName = currency.find(c => c.text == name)?.id || name
		let qr = {
			"query": {
				"status": {
					"option": "online"
				},
				"have": [
					"exalted"
				],
				"want": [
					foundName
				]
			},
			"sort": {
				"have": "asc"
			},
			"engine": "new"
		}
		let data = await searchBulkItems(qr)
		setTradeBulkItems(data)
	}

	const search = async () => {
		try {
			// Example search query for unique items
			let forceItemName = false;
			let isCurrency = false;
			if (itemData.type == "currency") {
				forceItemName = true;
				isCurrency = true;
				let foundCurrencyItem = currency.find(c => c.text == itemData.name)
				if (foundCurrencyItem)
					return await searchBulk(itemData.name)
			}
			const query = buildSearchQuery(itemData, selectedMods, forceItemName, isCurrency);
			console.log(query)
			const searchResult = await searchItems(query);
			console.log(searchResult)
			const items = await fetchItems(searchResult.result.slice(0, 10));
			console.log(items)
			setTradeItems(items)
			setSearchItemsData({
				id: searchResult.id,
				result: searchResult.result,
				total: searchResult.total,
				current: 10
			})
		} catch (error) {
			console.error('Search failed:', error);
		}
	}

	const loadMore = async () => {
		let tmpSearch = { ...searchItemsData }
		tmpSearch.result.splice(0, 10)
		const items = await fetchItems(tmpSearch.result.slice(0, 10));
		console.log(items)
		let tmpTradeItems = [...tradeItems, ...items]
		setTradeItems(tmpTradeItems)
		setSearchItemsData(tmpSearch)
	}

	const openWebsite = () => {
		console.log("https://www.pathofexile.com/trade2/search/poe2/Standard/" + searchItemsData.id)
		window.open("https://www.pathofexile.com/trade2/search/poe2/Standard/" + searchItemsData.id, "_blank")
	}

	return (
		<div className="bg-gray-900/70 text-white p-4 rounded-lg shadow-lg h-[100vh] flex flex-col border border-gray-700">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">Price Check</h2>
				<button
					onClick={() => {
						const window = Window.getCurrent();
						window.close()
					}}
					className="text-gray-400 hover:text-white"
				>
					×
				</button>
			</div>
			<div className="space-y-4">

				<div className='flex flex-col gap-1'>
					<div className='flex gap-3 items-center'>

						<span className={`${itemData.rarity == "Magic" ? "text-blue-400" :
							itemData.rarity == "Rare" ? "text-yellow-400" :
								"text-white"

							} text-center`}>{itemData.name} <br />{itemData.name != itemData.base && itemData.base}</span>
						<button onClick={search} className="bg-orange-400 p-1 rounded-lg text-[#333] border border-orange-300 transition-all hover:bg-orange-600 hover:border-orange-500">Check</button>
						{tradeItems.length > 0 && <button onClick={openWebsite} className="bg-orange-400 p-1 rounded-lg text-[#333] border border-orange-300 transition-all hover:bg-orange-600 hover:border-orange-500">Open website</button>}
					</div>

					{displayMods()}
				</div>
			</div>

			<div className="bg-gray-800 p-2 rounded flex flex-col gap-2 overflow-y-auto mt-2">
				{/* {JSON.stringify(itemData, null, 2)} */}
				<DisplayTradeitems tradeItems={tradeItems} />
				{tradeBulkItems && <DisplayBulkItems items={tradeBulkItems} />}
				{tradeItems.length > 0 && <button onClick={loadMore}>Load more</button>}
			</div>
		</div>
	);
}
