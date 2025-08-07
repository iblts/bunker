import prisma from '@/lib/prisma'
import { getErrorMessage, getIndexToSwap } from '@/src/helpers'
import type { SwapEverybodyCharsBody } from '@/src/types'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const body: SwapEverybodyCharsBody | undefined = await request.json()

	if (!body || !('characteristic' in body)) {
		return NextResponse.json(
			{ success: false, message: 'Неверное тело запроса' },
			{ status: 400 }
		)
	}

	const players = await prisma.player.findMany({
		orderBy: {
			id: 'asc',
		},
	})

	if (players.length < 2) {
		return NextResponse.json({ success: true }, { status: 200 })
	}

	const chars = players.map(player => player[body.characteristic])

	try {
		players.map(
			async (player, i, array) =>
				await prisma.player.update({
					where: {
						id: player.id,
					},
					data: {
						[body.characteristic]: chars[getIndexToSwap(i, array)],
					},
				})
		)
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: getErrorMessage(error) },
			{ status: 500 }
		)
	}

	return NextResponse.json({ success: true }, { status: 200 })
}
