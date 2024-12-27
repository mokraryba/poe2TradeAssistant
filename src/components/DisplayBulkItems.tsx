import { useEffect, useState } from 'react'
import { ExchangeItem } from '../types/exchangeItems'
import currency from '../data/currency.json'

export default function DisplayBulkItems({ items }: { items: ExchangeItem }) {

	let [parsedItems, setParsedItems] = useState(Object.keys(items.result).map(key => items.result[key]))

	useEffect(() => {
		setParsedItems(Object.keys(items.result).map(key => items.result[key]))
		console.log(Object.keys(items.result).map(key => items.result[key]))

	}, [items])

	return (
		parsedItems.map((item, itemIndex) => {
			let haveImg = `https://www.pathofexile.com` + currency.find(c => c.id == item.listing.offers[0].exchange.currency)?.image || ""
			let wantImg = `https://www.pathofexile.com` + currency.find(c => c.id == item.listing.offers[0].item.currency)?.image || ""

			let itemOffer = item.listing.offers[0].item
			let itemExchange = item.listing.offers[0].exchange

			return <div className='grid grid-cols-3 border-b-2 border-[#333]' key={itemIndex}>
				<div className='flex items-center justify-start'>
					<img style={{ height: "48px" }} src={wantImg} />
					<span className='text-[12px] text-gray-500'><span className="text-white">{itemOffer.stock || 1}</span> stock<br />{item.listing.account.name}</span>
				</div>
				<div className='flex-1 ml-3 text-center flex items-center justify-center flex-col'>
					<span>{itemOffer.amount} ⇐ {itemExchange.amount}</span>
					{parseFloat((itemExchange.amount / itemOffer.amount).toFixed(2))} {currency.find(c => c.id == itemExchange.currency)?.text}
				</div>

				<div className='justify-self-end'>

					<img style={{ height: "48px" }} src={haveImg} />
				</div>
			</div>
		})
	)
}
