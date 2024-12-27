import { SelectedMod } from "../components/PriceCheck";
import { ParsedItem } from "../hooks/useItemParse";

export function buildSearchQuery(item: ParsedItem, selectedMods: SelectedMod[], forceName: boolean, isCurrency: boolean = false) {

	let query: any = {
		query: {
			status: { option: "online" },
			// type: item.type,
			stats: [{
				type: "and",
				filters: selectedMods.map(mod => ({
					id: mod.id,
					disabled: !mod.checked,
					value: { min: mod.value }
				}))
			}],
			filters: {
				type_filters: {
					filters: {
						category: {
							option: item.type
						}
					}
				}
			}

		},
		sort: { price: "asc" }
	}
	if (forceName) {
		query.query.type = item.name
	}

	if (item.rarity == "Unique") {
		query.query.type = item.base
		query.query.name = item.name
	}

	if (isCurrency) {
		delete query.query.filters.type_filters.filters.category
	}

	if (item.rarity == "Unique") {
		query.query.filters.type_filters.filters.rarity = { option: "unique" }

	}

	return query;
}