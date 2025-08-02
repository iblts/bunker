import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const revalidate = 10

export async function GET(request: Request) {
	const data = await prisma.data.findFirst({ where: { id: 1 } })

	return NextResponse.json(data)
}

export async function POST(request: Request) {
	try {
		const json = await request.json()

		if (!json) {
			return NextResponse.json(
				{ message: 'Неверное тело запроса' },
				{ status: 400 }
			)
		}

		const data = await prisma.data.update({
			where: {
				id: 1,
			},
			data: json,
		})

		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ message: 'Ошибка при обработке запроса' },
			{ status: 500 }
		)
	}
}
