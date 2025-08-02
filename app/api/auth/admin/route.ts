import { PASSWORD } from '@/src/constants'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
	try {
		const { password } = await request.json()

		if (typeof password !== 'string') {
			return NextResponse.json(
				{ success: false, message: 'Пароль должен быть строкой' },
				{ status: 400 }
			)
		}

		if (password === PASSWORD) {
			return NextResponse.json({ success: true }, { status: 200 })
		}

		return NextResponse.json(
			{ success: false, message: 'Неверный пароль' },
			{ status: 403 }
		)
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: 'Ошибка при обработке запроса' },
			{ status: 500 }
		)
	}
}
