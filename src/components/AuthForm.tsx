'use client'

import { auth } from '@/src/api'
import { COOKIE_KEY_USER_ID } from '@/src/constants'
import { useMutation } from '@tanstack/react-query'
import cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface AuthFormData {
	name: string
}

export const AuthForm = () => {
	const router = useRouter()
	const { handleSubmit, register } = useForm<AuthFormData>({
		defaultValues: { name: '' },
	})

	const { mutateAsync, isPending } = useMutation({
		mutationFn: auth,
	})

	const onSubmit = async (formData: AuthFormData) => {
		try {
			const data = await mutateAsync(formData)

			if (data?.id) {
				cookie.set(COOKIE_KEY_USER_ID, String(data.id))
				router.push('/')
			} else {
				throw new Error('Не удалось авторизоваться')
			}
		} catch (error: any) {
			throw new Error(error?.message || 'Неизвестная ошибка')
		}
	}

	return (
		<form
			onSubmit={handleSubmit(data =>
				toast.promise(onSubmit(data), {
					loading: 'Вход...',
					success: <b>Вы вошли!</b>,
					error: (err: Error) => <b>{err.message}</b>,
				})
			)}
			className='w-[300px]'
		>
			<label className='flex gap-2 items-center flex-col'>
				Введите ваше имя
				<input
					className='bg-zinc-800 p-2 rounded w-full mb-4'
					type='text'
					{...register('name', { required: 'Введите имя' })}
					placeholder='Имя'
				/>
			</label>
			<button
				type='submit'
				className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded w-full disabled:opacity-40'
				disabled={isPending}
			>
				Войти
			</button>
		</form>
	)
}
