import prisma from '@/lib/prisma'
import type { SwapCharsBody } from '@/src/types'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const body: SwapCharsBody = await request.json()

	const player1 = await prisma.player.findFirst({
		where: {
			id: body.player1,
		},
	})

	const player2 = await prisma.player.findFirst({
		where: {
			id: body.player2,
		},
	})

	if (!player1 || !player2) {
		return NextResponse.json(
			{ success: false, message: 'Неверное тело запроса' },
			{ status: 400 }
		)
	}

	await prisma.player.update({
		where: {
			id: player1.id,
		},
		data: {
			[body.characteristic]: player2[body.characteristic],
		},
	})

	await prisma.player.update({
		where: {
			id: player2.id,
		},
		data: {
			[body.characteristic]: player1[body.characteristic],
		},
	})

	return NextResponse.json({ success: true }, { status: 200 })
}
