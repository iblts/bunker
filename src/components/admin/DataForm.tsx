'use client'

import type { Data } from '@/lib/generated/prisma-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getData, updateData } from '../../api'
import { generateData } from '../../helpers'
import { GeneratedInput } from '../ui/GeneratedInput'

export const DataForm = () => {
	const { mutate } = useMutation({
		mutationFn: updateData,
		onSuccess: () => toast.success('Данные успешно обновлены!'),
		onError: (e: Error) => toast.error(e.message),
	})

	const { register, handleSubmit, reset, setValue } =
		useForm<Omit<Data, 'id'>>()
	const { data } = useQuery({ queryKey: ['adminData'], queryFn: getData })

	useEffect(() => {
		if (data) reset(data)
	}, [data, reset])

	const generateAll = () => reset(generateData.all())

	const fields = [
		{ key: 'place', label: 'Место', generator: generateData.place },
		{ key: 'food', label: 'Запасы', generator: generateData.food },
		{ key: 'problem', label: 'Катастрофа', generator: generateData.problem },
		{ key: 'rooms', label: 'Комнаты', generator: generateData.rooms },
		{ key: 'size', label: 'Площадь', generator: generateData.size },
		{ key: 'time', label: 'Время', generator: generateData.time },
	] as const

	return (
		<div>
			<button
				onClick={generateAll}
				className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 mb-4 rounded w-full'
			>
				Сгенерировать
			</button>
			<form
				onSubmit={handleSubmit(data => mutate(data))}
				className='grid gap-4'
			>
				{fields.map(f => (
					<GeneratedInput
						key={f.key}
						label={f.label}
						placeholder={f.label}
						valueName={f.key}
						register={register}
						onGenerate={() => setValue(f.key, f.generator())}
					/>
				))}
				<GeneratedInput
					label='Доп инфа'
					placeholder='Доп инфа'
					valueName='extra'
					register={register}
					isTextarea
				/>
				<button
					type='submit'
					className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
				>
					Сохранить
				</button>
			</form>
		</div>
	)
}
