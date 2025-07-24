import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const revalidate = 10

export async function GET(request: Request) {
	const users = await prisma.player.findMany()

	return NextResponse.json(users)
}

export async function POST(request: Request) {
	const data = await prisma.data.create()

	return NextResponse.json(data)
}

export async function PUT(request: Request) {
	const { id, ...body } = await request.json()
	const data = await prisma.data.update({
		where: {
			id: id,
		},
		data: body,
	})

	return NextResponse.json(data)
}
