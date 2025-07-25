import type { Player } from './lib/generated/prisma-client'

export const BASE_URL = process.env.BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL
export const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD
export const CHARACTERISTICS: Map<keyof Player, string> = new Map()

CHARACTERISTICS.set('name', 'Имя')
CHARACTERISTICS.set('sex', 'Пол')
CHARACTERISTICS.set('profession', 'Профессия')
CHARACTERISTICS.set('health', 'Здоровье')
CHARACTERISTICS.set('age', 'Возраст')
CHARACTERISTICS.set('height', 'Рост')
CHARACTERISTICS.set('character', 'Характер')
CHARACTERISTICS.set('extra', 'Доп инфа')
CHARACTERISTICS.set('hobby', 'Хобби')
CHARACTERISTICS.set('inventory', 'Инвентарь')
CHARACTERISTICS.set('phobia', 'Фобия')
