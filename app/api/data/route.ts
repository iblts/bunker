import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const revalidate = 10

export async function GET(request: Request) {
	const data = await prisma.data.findFirst({ where: { id: 1 } })

	return NextResponse.json(data)
}

export async function POST(request: Request) {
	const data = await prisma.data.update({
		where: {
			id: 1,
		},
		data: await request.json(),
	})

	return NextResponse.json(data)
}
