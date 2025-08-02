import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id
	const data = await prisma.player.findFirst({ where: { id: +id } })

	return NextResponse.json(data)
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id
	const data = await prisma.player.delete({ where: { id: +id } })

	return NextResponse.json(data)
}
