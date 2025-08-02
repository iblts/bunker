import { getPlayerById } from '@/src/api'
import { MainPage } from '@/src/components/MainPage'
import { COOKIE_KEY_USER_ID } from '@/src/constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
	const cookieStorage = await cookies()
	const id = cookieStorage.get(COOKIE_KEY_USER_ID)?.value

	if (!id) return redirect('/auth')

	try {
		const player = await getPlayerById(+id)
		return <MainPage userId={player.id} />
	} catch {
		return redirect('/auth')
	}
}
