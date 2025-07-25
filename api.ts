import { BASE_URL } from './constants'
import { Data, Player } from './lib/generated/prisma-client'

export const getPlayers = async () => {
	const res = await fetch(`${BASE_URL}/api/players`)
	const players = await res.json()

	return players as Player[]
}

export const getData = async () => {
	const res = await fetch(`${BASE_URL}/api/data`)
	const data = await res.json()

	return data as Data
}

export const updateData = async (body: Omit<Data, 'id'>) => {
	const res = await fetch(`${BASE_URL}/api/data`, {
		method: 'POST',
		body: JSON.stringify(body),
	})
	const data = await res.json()

	return data as Data
}

export const createPlayer = async () => {
	const res = await fetch(`${BASE_URL}/api/players`, {
		method: 'POST',
	})
	const data = await res.json()

	return data as Data
}

export const deletePlayer = async (id: number) => {
	const res = await fetch(`${BASE_URL}/api/players/${id}`, {
		method: 'DELETE',
	})
	const data = await res.json()

	return data as Data
}

export const updatePlayer = async (body: Player) => {
	const res = await fetch(`${BASE_URL}/api/players`, {
		method: 'PUT',
		body: JSON.stringify(body),
	})
	const data = await res.json()

	return data as Data
}
