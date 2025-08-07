import type { Player } from '@/lib/generated/prisma-client'

export interface Option<T extends string = string> {
	label: string
	value: T
}

export type Characters =
	| 'Пол'
	| 'Возраст'
	| 'Профессия'
	| 'Здоровье'
	| 'Рост'
	| 'Фобия'
	| 'Хобби'
	| 'Инвентарь'
	| 'Характер'
	| 'Доп инфа'
	| 'Карточка 1'
	| 'Карточка 2'

export type PlayerCharacteristics = Omit<Player, 'id' | 'name' | 'opened'>

export interface SwapCharsBody {
	player1: number
	player2: number
	characteristic: keyof PlayerCharacteristics
}

export interface SwapEverybodyCharsBody {
	characteristic: keyof PlayerCharacteristics
}

interface ResponseSuccess<T> {
	success: true
	message: never
	data: T
}

interface ResponseFailure {
	success: false
	message: string
}

export type ConditionalResponse<T = never> =
	| ResponseFailure
	| ResponseSuccess<T>

export type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never
