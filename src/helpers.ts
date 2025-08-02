import type { Data, Player } from '@/lib/generated/prisma-client'
import { bunker, characteristics } from './constants'

export const playerDto = (player: Player) => {
	const characteristics = [
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

const getNoun = (number: number, one: string, two: string, five: string) => {
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

export const generateHealth = () => {
	const disease = getRandomFromArray(characteristics.health)
	const health =
		disease === 'Идеально здоров'
			? disease
			: `${disease} (${getRandom(1, 10) * 10}%)`

	return health
}
export const generateHeight = () =>
	`${getRandom(140, 210)}см, ${getRandomFromArray(characteristics.height)}`
export const generateCharacter = () =>
	getRandomFromArray(characteristics.character)
export const generateExtra = () => getRandomFromArray(characteristics.extra)
export const generateInventory = () =>
	getRandomFromArray(characteristics.inventory)
export const generatePhobia = () => getRandomFromArray(characteristics.phobia)
export const generateHobby = () => getRandomFromArray(characteristics.hobby)
export const generateAge = (sex: string) => {
	const ageNumber = getRandom(14, 100)
	const age = `${ageNumber} ${getNoun(ageNumber, 'год', 'года', 'лет')}, ${
		ageNumber > 54 ? 'Бесплоден' : getRandomFromArray(characteristics.age)
	}`

	return age
}
export const generateSex = () => getRandomFromArray(characteristics.sex)
export const generateProfession = (age: string) => {
	const experience = getRandom(0, Number(age.split(' ')[0]) - 10)
	const profession = `${getRandomFromArray(
		characteristics.professions
	)}, ${experience} ${getNoun(experience, 'год', 'года', 'лет')}`

	return profession
}
export const generateCard = () => getRandomFromArray(characteristics.cards)

export const createCharacter = (): Pick<
	Player,
	| 'age'
	| 'character'
	| 'extra'
	| 'health'
	| 'height'
	| 'hobby'
	| 'inventory'
	| 'phobia'
	| 'profession'
	| 'sex'
	| 'card1'
	| 'card2'
> => {
	const sex = generateSex()
	const age = generateAge(sex)

	return {
		age: age,
		character: generateCharacter(),
		extra: generateExtra(),
		health: generateHealth(),
		height: generateHeight(),
		hobby: generateHobby(),
		inventory: generateInventory(),
		phobia: generatePhobia(),
		profession: generateProfession(age),
		sex,
		card1: generateCard(),
		card2: generateCard(),
	}
}

export const generateFood = () => getRandomFromArray(bunker.food)
export const generatePlace = () => getRandomFromArray(bunker.place)
export const generateProblem = () => getRandomFromArray(bunker.disaster)
export const generateRooms = () =>
	new Array(4)
		.fill('')
		.map(() => getRandomFromArray(bunker.rooms))
		.join(', ')
export const generateSize = () => getRandomFromArray(bunker.size)
export const generateTime = () => getRandomFromArray(bunker.time)

export const createData = (): Omit<Data, 'id'> => {
	return {
		extra: '',
		food: generateFood(),
		place: generatePlace(),
		problem: generateProblem(),
		rooms: generateRooms(),
		size: generateSize(),
		time: generateTime(),
	}
}

export const generateNewPlayerData = (player: Player): Player => {
	const newCharacter = createCharacter()
	return {
		...player,
		...newCharacter,
		opened: '',
	}
}
