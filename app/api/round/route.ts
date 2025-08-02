import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const GET = async () => {
	const data = await prisma.round.findFirst({
		where: {
			id: 1,
		},
	})

	return NextResponse.json(data, { status: 200 })
}

export const PUT = async (request: Request) => {
	const json = await request.json()

	const data = await prisma.round.update({
		data: json,
		where: {
			id: 1,
		},
	})

	return NextResponse.json(data, { status: 200 })
}
