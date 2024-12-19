export interface TradeItem {
	id: string
	listing: Listing
	item: Item
}

export interface Listing {
	method: string
	indexed: string
	stash: Stash
	whisper: string
	account: Account
	price: Price
}

export interface Stash {
	name: string
	x: number
	y: number
}

export interface Account {
	name: string
	online: Online
	lastCharacterName: string
	language: string
	realm: string
}

export interface Online {
	league: string
}

export interface Price {
	type: string
	amount: number
	currency: string
}

export interface Item {
	realm: string
	verified: boolean
	w: number
	h: number
	icon: string
	league: string
	id: string
	name: string
	typeLine: string
	baseType: string
	rarity: string
	ilvl: number
	identified: boolean
	properties: Property[]
	requirements: Requirement[]
	grantedSkills: GrantedSkill[]
	explicitMods: string[]
	frameType: number
	extended: Extended
}

export interface Property {
	name: string
	values: any[]
	displayMode: number
}

export interface Requirement {
	name: string
	values: [string, number][]
	displayMode: number
	type: number
}

export interface GrantedSkill {
	name: string
	values: [string, number][]
	displayMode: number
	icon: string
}

export interface Extended {
	mods: Mods
	hashes: Hashes
}

export interface Mods {
	explicit: Explicit[]
}

export interface Explicit {
	name: string
	tier: string
	level: number
	magnitudes: Magnitude[]
}

export interface Magnitude {
	hash: string
	min: string
	max: string
}

export interface Hashes {
	explicit: [string, number[]][]
	skill: string | undefined[][]
}
