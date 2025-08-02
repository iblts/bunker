import { Data, Player, Round } from '../lib/generated/prisma-client'
import { BASE_URL } from './constants'

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
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})

	let data
	try {
		data = await res.json()
	} catch {
		throw new Error('Ошибка разбора ответа сервера')
	}

	if (!res.ok) {
		throw new Error(data?.message || 'Ошибка при обновлении данных')
	}

	return data as Data
}

export const createPlayer = async () => {
	const res = await fetch(`${BASE_URL}/api/players`, {
		method: 'POST',
	})
	let data
	try {
		data = await res.json()
	} catch {
		throw new Error('Ошибка разбора ответа сервера')
	}

	if (!res.ok) {
		throw new Error(data?.message || 'Ошибка при обновлении данных')
	}

	return data as Data
}

export const deletePlayer = async (id: number) => {
	const res = await fetch(`${BASE_URL}/api/players/${id}`, {
		method: 'DELETE',
	})
	let data
	try {
		data = await res.json()
	} catch {
		throw new Error('Ошибка разбора ответа сервера')
	}

	if (!res.ok) {
		throw new Error(data?.message || 'Ошибка при обновлении данных')
	}

	return data as Data
}

export const getPlayerById = async (id: number): Promise<Player> => {
	const res = await fetch(`${BASE_URL}/api/players/${id}`)

	let data: unknown

	try {
		data = await res.json()
	} catch {
		throw new Error('Некорректный JSON от сервера')
	}

	if (!res.ok) {
		const message =
			typeof data === 'object' &&
			data !== null &&
			'message' in data &&
			typeof (data as any).message === 'string'
				? (data as any).message
				: 'Ошибка при получении игрока'

		throw new Error(message)
	}

	return data as Player
}

export const updatePlayer = async (body: Partial<Player>) => {
	const res = await fetch(`${BASE_URL}/api/players`, {
		method: 'PUT',
		body: JSON.stringify(body),
	})
	let data
	try {
		data = await res.json()
	} catch {
		throw new Error('Ошибка разбора ответа сервера')
	}

	if (!res.ok) {
		throw new Error(data?.message || 'Ошибка при обновлении данных')
	}

	return data as Player
}

export const auth = async (body: { name: string }) => {
	const res = await fetch(`${BASE_URL}/api/auth`, {
		method: 'POST',
		body: JSON.stringify(body),
	})
	const data = await res.json()

	return data as Player
}

export const getRound = async () => {
	const res = await fetch(`${BASE_URL}/api/round`)
	const data = await res.json()

	return data as Round
}

export const updateRound = async (body: Partial<Round>) => {
	const res = await fetch(`${BASE_URL}/api/round`, {
		method: 'PUT',
		body: JSON.stringify(body),
	})
	let data
	try {
		data = await res.json()
	} catch {
		throw new Error('Ошибка разбора ответа сервера')
	}

	if (!res.ok) {
		throw new Error(data?.message || 'Ошибка при обновлении данных')
	}

	return data as Round
}

interface AdminAuthSuccess {
	success: true
	message: never
}

interface AdminAuthFailure {
	success: false
	message: string
}

export const adminAuth = async (body: { password: string }) => {
	const res = await fetch(`${BASE_URL}/api/auth/admin`, {
		method: 'POST',
		body: JSON.stringify(body),
	})
	const data = await res.json()

	return data as AdminAuthFailure | AdminAuthSuccess
}
