import { TradeItem } from '../types/items'
import currency from '../data/currency.json'
import { formatText } from '../hooks/useItemParse'

export default function DisplayTradeitems({ tradeItems }: { tradeItems: TradeItem[] }) {
	return tradeItems.map((item, index) => {
		let foundCurrIcon = `https://www.pathofexile.com` + currency.find(c => c.id == item.listing.price.currency)?.image || ""

		return <div className='flex items-center border-b-2 border-[#333]' key={index}>
			<img style={{ height: "64px" }} src={item.item.icon} />
			<div className='flex-1 ml-3'>
				{item.item.explicitMods?.length > 0 && item.item.explicitMods.map((mod, index) => <div key={index}>{formatText(mod)}</div>)}
			</div>
			{item.listing.price.amount} <img style={{ width: "32px", height: "32px" }} src={foundCurrIcon} />
		</div>
	})
}
