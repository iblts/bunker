'use client'

import { adminAuth } from '@/src/api'
import { DataForm } from '@/src/components/admin/DataForm'
import { PlayerForm } from '@/src/components/admin/PlayerForm'
import { RoundForm } from '@/src/components/admin/RoundForm'
import { SwapForm } from '@/src/components/admin/SwapForm'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'
import toast from 'react-hot-toast'

export default function Admin() {
	const router = useRouter()
	const { mutateAsync } = useMutation({
		mutationFn: adminAuth,
		onSuccess: () => {
			toast.success('Данные успешно обновлены!')
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	useLayoutEffect(() => {
		const password = prompt('Пароль')
		const fetchAuth = async () => {
			if (!password) {
				router.push('/')
				return
			}
			const res = await mutateAsync({ password })
			if (res.success) {
				toast.success('Вы успешно вошли')
			} else {
				toast.error(res.message)
				router.push('/')
			}
		}
		fetchAuth()
	}, [mutateAsync, router])

	return (
		<div className='p-20 flex gap-[100px] justify-items-center'>
			<DataForm />
			<PlayerForm />
			<div className='flex flex-col gap-8'>
				<RoundForm />
				<SwapForm />
			</div>
		</div>
	)
}
