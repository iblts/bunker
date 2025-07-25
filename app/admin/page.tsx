'use client'

import {
	createPlayer,
	deletePlayer,
	getData,
	getPlayers,
	updateData,
	updatePlayer,
} from '@/api'
import { Data, Player } from '@/lib/generated/prisma-client'
import { queryClient } from '@/lib/query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Admin() {
	const { data: players } = useQuery({
		queryKey: ['player'],
		queryFn: getPlayers,
	})
	const [selectedPlayer, setSelectedPlayer] = useState(0)

	const { data: data } = useQuery({
		queryKey: ['data'],
		queryFn: getData,
	})

	const {
		register: dataRegister,
		handleSubmit: handleDataSubmit,
		formState: { errors: dataErrors },
		reset: resetData,
	} = useForm<Omit<Data, 'id'>>()

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<Player>()

	const { mutate } = useMutation({ mutationFn: updateData })
	const { mutate: mutatePlayer } = useMutation({
		mutationFn: updatePlayer,
		onSuccess() {
			queryClient.refetchQueries({ queryKey: ['player'] })
		},
	})
	const { mutate: mutateCreatePlayer } = useMutation({
		mutationFn: createPlayer,
		onSuccess() {
			queryClient.refetchQueries({ queryKey: ['player'] })
		},
	})
	const { mutate: mutateDeletePlayer } = useMutation({
		mutationFn: deletePlayer,
		onSuccess() {
			queryClient.refetchQueries({ queryKey: ['player'] })
		},
	})

	const options = players?.map(player => ({
		label: player.name,
		value: player.id,
	}))

	useEffect(() => {
		if (data) {
			resetData(data)
		}
	}, [data])

	useEffect(() => {
		if (players && players.length > 0) {
			setSelectedPlayer(prev => (prev === 0 ? players[0].id : prev))
		}
	}, [players])

	useEffect(() => {
		const player = players?.find(p => p.id === selectedPlayer)
		if (player) {
			reset(player)
		}
	}, [selectedPlayer, players])

	return (
		<div className='p-20 flex gap-[200px] justify-items-center'>
			<div>
				<form
					onSubmit={handleDataSubmit(data => mutate(data))}
					className='grid gap-4'
				>
					<label className='flex gap-2 items-center'>
						Место
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('place')}
							placeholder='Место'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Запасы
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('food')}
							placeholder='Запасы'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Катастрофа
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('problem')}
							placeholder='Катастрофа'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Комнаты
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('rooms')}
							placeholder='Комнаты'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Площадь
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('size')}
							placeholder='Площадь'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Время
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...dataRegister('time')}
							placeholder='Время'
						/>
					</label>
					<label className='flex gap-2 items-center'>
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

			{/**********************************************/}

			<div>
				<div className='flex gap-4'>
					<button
						className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 mb-4 rounded'
						onClick={() => mutateCreatePlayer()}
					>
						Добавить игрока
					</button>
					<button
						className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 mb-4 rounded'
						onClick={() => mutateDeletePlayer(selectedPlayer)}
					>
						Удалить игрока
					</button>
				</div>

				<select
					value={selectedPlayer}
					onChange={e => setSelectedPlayer(+e.target.value)}
					name='user'
					className='bg-zinc-800 cursor-pointer px-4 py-2 rounded mb-4 w-full'
				>
					{options?.map(option => (
						<option value={option.value} key={option.value}>
							{option.label ?? 'Аноним'}
						</option>
					))}
				</select>

				<form
					onSubmit={handleSubmit(data => mutatePlayer(data))}
					className='grid gap-4 p-4'
				>
					<label className='flex gap-2 items-center'>
						Имя
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('name')}
							placeholder='Имя'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Возраст
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('age')}
							placeholder='Возраст'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Здоровье
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('health')}
							placeholder='Здоровье'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Характер
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('character')}
							placeholder='Характер'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Доп инфа
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('extra')}
							placeholder='Доп инфа'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Рост
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('height')}
							placeholder='Рост'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Хобби
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('hobby')}
							placeholder='Хобби'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Инвентарь
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('inventory')}
							placeholder='Инвентарь'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Фобия
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('phobia')}
							placeholder='Фобия'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Профессия
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('profession')}
							placeholder='Профессия'
						/>
					</label>
					<label className='flex gap-2 items-center'>
						Пол
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('sex')}
							placeholder='Пол'
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
		</div>
	)
}
