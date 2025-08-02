import { getPlayerById } from '@/src/api'
import { AuthForm } from '@/src/components/AuthForm'
import { COOKIE_KEY_USER_ID } from '@/src/constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthPage() {
	const cookieStorage = await cookies()
	const id = cookieStorage.get(COOKIE_KEY_USER_ID)

	if (id) {
		try {
			const player = await getPlayerById(+id.value)
			if (player) return redirect('/')
			cookieStorage.delete(COOKIE_KEY_USER_ID)
		} catch {}
	}

	return (
		<section className='flex justify-center mt-[300px]'>
			<AuthForm />
		</section>
	)
}
