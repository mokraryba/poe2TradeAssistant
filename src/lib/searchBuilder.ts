import { SelectedMod } from "../components/PriceCheck";
import { ParsedItem } from "../hooks/useItemParse";

export function buildSearchQuery(item: ParsedItem, selectedMods: SelectedMod[]) {

	let query: any = {
		query: {
			status: { option: "online" },
			// name: item.base,
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

	if (item.rarity == "Unique") {
		query.query.filters.type_filters.filters.rarity = { option: "unique" }

	}

	return query;
}