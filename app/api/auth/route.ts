import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const body = await request.json()
	const data = await prisma.player.create({
		data: {
			name: body.name,
		},
	})

	return NextResponse.json(data)
}
