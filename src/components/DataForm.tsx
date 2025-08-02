'use client'

import { Data } from '@/lib/generated/prisma-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getData, updateData } from '../api'
import {
	createData,
	generateFood,
	generatePlace,
	generateProblem,
	generateRooms,
	generateSize,
	generateTime,
} from '../helpers'

export const DataForm = () => {
	const { mutate } = useMutation({
		mutationFn: updateData,
		onSuccess: () => {
			toast.success('Данные успешно обновлены!')
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	const {
		register: dataRegister,
		handleSubmit: handleDataSubmit,
		reset: resetData,
		setValue,
	} = useForm<Omit<Data, 'id'>>()

	const { data: data } = useQuery({
		queryKey: ['adminData'],
		queryFn: getData,
		refetchOnWindowFocus: false,
		refetchInterval: false,
	})

	const generateData = () => {
		const generatedData = createData()
		resetData(generatedData)
	}

	useEffect(() => {
		if (data) {
			resetData(data)
		}
	}, [data])

	return (
		<div>
			<button
				onClick={generateData}
				className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 mb-4 rounded w-full'
			>
				Сгенерировать
			</button>
			<form
				onSubmit={handleDataSubmit(data => mutate(data))}
				className='grid gap-4'
			>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Место
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('place')}
							placeholder='Место'
						/>
					</label>
					<button
						onClick={() => {
							setValue('place', generatePlace())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Запасы
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('food')}
							placeholder='Запасы'
						/>
					</label>
					<button
						onClick={() => {
							setValue('food', generateFood())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Катастрофа
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('problem')}
							placeholder='Катастрофа'
						/>
					</label>
					<button
						onClick={() => {
							setValue('problem', generateProblem())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Комнаты
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('rooms')}
							placeholder='Комнаты'
						/>
					</label>
					<button
						onClick={() => {
							setValue('rooms', generateRooms())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Площадь
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('size')}
							placeholder='Площадь'
						/>
					</label>
					<button
						onClick={() => {
							setValue('size', generateSize())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Время
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('time')}
							placeholder='Время'
						/>
					</label>
					<button
						onClick={() => {
							setValue('time', generateTime())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<label className='grid grid-cols-[100px_1fr] gap-2 items-center'>
					Доп инфа
					<textarea
						className='bg-zinc-800 p-2 rounded w-full'
						{...dataRegister('extra')}
						placeholder='Доп инфа'
					/>
				</label>
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
