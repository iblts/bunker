import type { Data, Player } from '@/lib/generated/prisma-client'
import { bunker, characteristics } from './constants'
import type { Characters, Option, PlayerCharacteristics } from './types'

export const playerDto = (player: Player) => {
	const characteristics: { key: Characters; value: string | null }[] = [
		{ key: 'Пол', value: player.sex },
		{ key: 'Возраст', value: player.age },
		{ key: 'Профессия', value: player.profession },
		{ key: 'Здоровье', value: player.health },
		{ key: 'Рост', value: player.height },
		{ key: 'Фобия', value: player.phobia },
		{ key: 'Хобби', value: player.hobby },
		{ key: 'Инвентарь', value: player.inventory },
		{ key: 'Характер', value: player.character },
		{ key: 'Доп инфа', value: player.extra },
		{ key: 'Карточка 1', value: player.card1 },
		{ key: 'Карточка 2', value: player.card2 },
	]

	return {
		id: player.id,
		name: player.name,
		opened: player.opened?.split(','),
		characteristics,
	}
}

export const getNoun = (
	number: number,
	one: string,
	two: string,
	five: string
) => {
	let n = Math.abs(number)
	n %= 100
	if (n >= 5 && n <= 20) {
		return five
	}
	n %= 10
	if (n === 1) {
		return one
	}
	if (n >= 2 && n <= 4) {
		return two
	}
	return five
}

const getRandom = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min
const getRandomFromArray = <T>(array: T[]) =>
	array[Math.floor(Math.random() * array.length)]
const getRandomRange = (
	ranges = [
		{ min: 30, max: 40, weight: 25 },
		{ min: 20, max: 30, weight: 20 },
		{ min: 40, max: 50, weight: 20 },
		{ min: 14, max: 20, weight: 15 },
		{ min: 50, max: 60, weight: 15 },
		{ min: 60, max: 100, weight: 5 },
	]
) => {
	const totalWeight = ranges.reduce((sum, r) => sum + r.weight, 0)
	const random = Math.random() * totalWeight

	let cumulative = 0
	let selectedRange = ranges[0]

	for (const range of ranges) {
		cumulative += range.weight
		if (random < cumulative) {
			selectedRange = range
			break
		}
	}

	return selectedRange
}

export const generatePlayer = {
	health: () => {
		const disease = getRandomFromArray(characteristics.health)
		const health =
			disease === 'Идеально здоров'
				? disease
				: `${disease} (${getRandom(1, 10) * 10}%)`

		return health
	},
	height: () =>
		`${getRandom(140, 210)}см, ${getRandomFromArray(characteristics.height)}`,
	character: () => getRandomFromArray(characteristics.character),
	extra: () => getRandomFromArray(characteristics.extra),
	inventory: () => getRandomFromArray(characteristics.inventory),
	phobia: () => getRandomFromArray(characteristics.phobia),
	hobby: () => getRandomFromArray(characteristics.hobby),
	age: () => {
		const range = getRandomRange()
		const ageNumber = getRandom(range.min, range.max)

		const experienceRange = getRandomRange([
			{ min: 0, max: Math.min(2, ageNumber - 10), weight: 20 },
			{
				min: Math.min(2, ageNumber - 10),
				max: Math.min(5, ageNumber - 10),
				weight: 35,
			},
			{
				min: Math.min(5, ageNumber - 10),
				max: Math.min(10, ageNumber - 10),
				weight: 20,
			},
			{
				min: Math.min(10, ageNumber - 10),
				max: Math.min(20, ageNumber - 10),
				weight: 15,
			},
			{
				min: Math.min(20, ageNumber - 10),
				max: ageNumber - 10,
				weight: 10,
			},
		])
		const experience = getRandom(experienceRange.min, experienceRange.max)
		const age = `${ageNumber} ${getNoun(
			ageNumber,
			'год',
			'года',
			'лет'
		)}, стаж ${experience} ${getNoun(experience, 'год', 'года', 'лет')}, ${
			ageNumber > 54 ? 'Бесплоден' : getRandomFromArray(characteristics.age)
		}`

		return age
	},
	sex: () => getRandomFromArray(characteristics.sex),
	profession: () => getRandomFromArray(characteristics.professions),
	card: () => getRandomFromArray(characteristics.cards),
	all: (): PlayerCharacteristics => {
		const age = generatePlayer.age()

		return {
			age: age,
			character: generatePlayer.character(),
			extra: generatePlayer.extra(),
			health: generatePlayer.health(),
			height: generatePlayer.height(),
			hobby: generatePlayer.hobby(),
			inventory: generatePlayer.inventory(),
			phobia: generatePlayer.phobia(),
			profession: generatePlayer.profession(),
			sex: generatePlayer.sex(),
			card1: generatePlayer.card(),
			card2: generatePlayer.card(),
		}
	},
}

export const generateData = {
	food: () => getRandomFromArray(bunker.food),
	place: () => getRandomFromArray(bunker.place),
	problem: () => getRandomFromArray(bunker.disaster),
	rooms: () =>
		new Array(4)
			.fill('')
			.map(() => getRandomFromArray(bunker.rooms))
			.join(', '),
	size: () => getRandomFromArray(bunker.size),
	time: () => getRandomFromArray(bunker.time),
	all: (): Omit<Data, 'id'> => {
		return {
			extra: '',
			food: generateData.food(),
			place: generateData.place(),
			problem: generateData.problem(),
			rooms: generateData.rooms(),
			size: generateData.size(),
			time: generateData.time(),
		}
	},
}

export const generateNewPlayerData = (player: Player): Player => {
	const newCharacter = generatePlayer.all()
	return {
		...player,
		...newCharacter,
		opened: '',
	}
}

export const swapField = <T extends keyof Player>(
	player1: Player,
	player2: Player,
	field: T
) => {
	const temp = player1[field]
	player1[field] = player2[field]
	player2[field] = temp
}

export const playerToOptionDto = (player: Player): Option => ({
	value: String(player.id),
	label: player.name ?? '',
})
