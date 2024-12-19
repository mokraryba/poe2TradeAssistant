import mods from '../data/mods.json'

export interface ParsedItem {
	name: string
	base: string
	rarity: 'Normal' | 'Magic' | 'Rare' | 'Unique'
	itemLevel: number
	type: string
	mods: Mod[]
}

interface Mod {
	value: number
	text: string
	raw: string
	id: string
}

const parseClass = (baseClass: string) => {
	if (baseClass == "Jewels") return "jewel"
	if (baseClass == "Claws") return "weapon.claw"
	if (baseClass == "Daggers") return "weapon.dagger"
	if (baseClass == "Wands") return "weapon.wand"
	if (baseClass == "Staves") return "weapon.staff"
	if (baseClass == "Sceptres") return "weapon.sceptre"
	if (baseClass == "One Hand Axes") return "weapon.oneaxe"
	if (baseClass == "Two Hand Axes") return "weapon.twoaxe"
	if (baseClass == "Bows") return "weapon.bow"
	if (baseClass == "Crossbows") return "weapon.crossbow"
	if (baseClass == "Wands") return "weapon.wand"
	if (baseClass == "Sceptres") return "weapon.sceptre"
	if (baseClass == "One Hand Maces") return "weapon.onemace"
	if (baseClass == "Two Hand Maces") return "weapon.twomace"
	if (baseClass == "Quarterstaves") return "weapon.warstaff"
	if (baseClass == "One Hand Swords") return "weapon.onesword"
	if (baseClass == "Two Hand Swords") return "weapon.twosword"
	if (baseClass == "Flails") return "weapon.flail"
	if (baseClass == "Spears") return "weapon.spear"

	if (baseClass == "Helmets") return "armour.helmet"
	if (baseClass == "Body Armours") return "armour.chest"
	if (baseClass == "Boots") return "armour.boots"
	if (baseClass == "Gloves") return "armour.gloves"
	if (baseClass == "Bucklers") return "armour.buckler"
	if (baseClass == "Focuses") return "armour.focus"

	if (baseClass == "Belts") return "accessory.belt"
	if (baseClass == "Rings") return "accessory.ring"
	if (baseClass == "Amulets") return "accessory.amulet"

	if (baseClass == "Skill Gems") return "gem.activegem"
	if (baseClass == "Stackable Currency") return "currency"
	if (baseClass == "Runes") return "rune"
	if (baseClass == "Life Flasks") return "flask.life"
	if (baseClass == "Mana Flasks") return "flask.mana"

	return baseClass
}


export const formatText = (input: string): string => {
	return input.replace(/\[(.*?)\]/g, (_, content) => {
		if (content.includes('|')) {
			const options = content.split('|')
			return options[options.length - 1].trim()
		}
		return content
	})
}


let parsedMods = mods.map(c => ({
	...c,
	text: formatText(c.text)
}))

export function parseFullItem(itemText: string): ParsedItem {
	itemText = itemText.replace(/\r\n/g, '\n')
	const sections = itemText.split('--------')


	// Extract basic item info
	const headerSection = sections[0].trim().split('\n')
	let itemClass = headerSection[0].replace('Item Class: ', '')
	const rarity = headerSection[1].replace('Rarity: ', '') as 'Normal' | 'Magic' | 'Rare' | 'Unique'
	const name = headerSection[2].trim()
	const base = headerSection.slice(-1)[0].trim()

	// Extract item level
	const itemLevelMatch = itemText.match(/Item Level: (\d+)/)
	const itemLevel = itemLevelMatch ? parseInt(itemLevelMatch[1]) : 0

	// Find the section containing affixes by checking each section against allMods
	const modSection = findModSection(sections)
	const mods = modSection ? parseModSection(modSection) : []
	console.log({ mods })

	itemClass = parseClass(itemClass)

	return {
		name,
		type: itemClass,
		base,
		rarity,
		itemLevel,
		mods
	}
}

function findModSection(sections: string[]): string | null {
	try {

		return sections.find(section => {
			const lines = section.trim().split('\n');
			return lines.some(line => {
				const lineWithoutPlus = line.replace(/^\+/, '');
				return parsedMods.some(template => {
					const normalizedTemplate = formatText(template.text)
						.replace(/\[.*?\|/g, '')
						.replace(/\]/g, '')
						.replace(/[0-9]+/g, '#');

					const normalizedLine = lineWithoutPlus
						.replace(/[0-9]+/g, '#')
						.replace(/^\+/, '');

					return normalizedLine === normalizedTemplate;
				});
			});
		}) || null;
	} catch (err) {
		console.log(err)
		return null;
	}
}

function parseModSection(section: string): Mod[] {
	return section
		.split('\n')
		.filter(line => line.trim() !== '')
		.map(line => {
			const lineWithoutPlus = line.replace(/^\+/, '');
			const numbers = line.match(/\d+/g)?.map(Number) || [];

			const modTemplate = parsedMods.find(template => {
				const normalizedTemplate = formatText(template.text)
					.replace(/\[.*?\|/g, '')
					.replace(/\]/g, '')
					.replace(/[0-9]+/g, '#');

				const normalizedLine = lineWithoutPlus
					.replace(/[0-9]+/g, '#')
					.replace(/^\+/, '');

				return normalizedLine === normalizedTemplate;
			});

			if (!modTemplate) return null;

			return {
				value: numbers[0],
				text: line,
				raw: modTemplate.text,
				id: modTemplate.id
			};
		})
		.filter((mod): mod is Mod => mod !== null);
}