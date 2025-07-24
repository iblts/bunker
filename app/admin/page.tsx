'use client'

import {
	createPlayer,
	getData,
	getPlayers,
	updateData,
	updatePlayer,
} from '@/api'
import { Data, Player } from '@/lib/generated/prisma-client'
import { queryClient } from '@/lib/query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Admin() {
	const { data: players } = useQuery({
		queryKey: ['player'],
		queryFn: getPlayers,
	})
	const [selectedPlayer, setSelectedPlayer] = useState(players?.[0]?.id)

	const { data: data } = useQuery({
		queryKey: ['data'],
		queryFn: getData,
	})

	const {
		register: dataRegister,
		handleSubmit: handleDataSubmit,
		formState: { errors: dataErrors },
	} = useForm<Omit<Data, 'id'>>({ defaultValues: data })

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Player>({
		defaultValues: players?.find(player => player.id === selectedPlayer),
	})

	const { mutate } = useMutation({ mutationFn: updateData })
	const { mutate: mutatePlayer } = useMutation({ mutationFn: updatePlayer })
	const { mutate: mutateCreatePlayer } = useMutation({
		mutationFn: createPlayer,
		onSuccess() {
			queryClient.refetchQueries({ queryKey: ['player'] })
		},
	})

	const options = players?.map(player => ({
		label: player.name,
		value: player.id,
	}))

	console.log(players)

	return (
		<div className='p-20 flex justify-evenly'>
			<div>
				{JSON.stringify(dataErrors)}
				<form
					onSubmit={handleDataSubmit(data => mutate(data))}
					className='grid gap-4'
				>
					<label className='flex gap-2'>
						Место
						<input type='text' {...dataRegister('place')} placeholder='Место' />
					</label>
					<label className='flex gap-2'>
						Запасы
						<input type='text' {...dataRegister('food')} placeholder='Запасы' />
					</label>
					<label className='flex gap-2'>
						Катастрофа
						<input
							type='text'
							{...dataRegister('problem')}
							placeholder='Катастрофа'
						/>
					</label>
					<label className='flex gap-2'>
						Комнаты
						<input
							type='text'
							{...dataRegister('rooms')}
							placeholder='Комнаты'
						/>
					</label>
					<label className='flex gap-2'>
						Площадь
						<input
							type='text'
							{...dataRegister('size')}
							placeholder='Площадь'
						/>
					</label>
					<label className='flex gap-2'>
						Время
						<input type='text' {...dataRegister('time')} placeholder='Время' />
					</label>
					<button type='submit'>Сохранить</button>
				</form>
			</div>

			{/**********************************************/}

			<div>
				<button
					className='uppercase block p-2'
					onClick={() => mutateCreatePlayer()}
				>
					Добавить игрока
				</button>
				<select
					value={selectedPlayer}
					onChange={e => setSelectedPlayer(+e.target.value)}
					name='user'
				>
					{options?.map(option => (
						<option value={option.value}>{option.label ?? 'Аноним'}</option>
					))}
				</select>

				{JSON.stringify(errors)}
				<form
					onSubmit={handleSubmit(data => mutatePlayer(data))}
					className='grid gap-4'
				>
					<label className='flex gap-2'>
						Имя
						<input type='text' {...register('name')} placeholder='Имя' />
					</label>
					<label className='flex gap-2'>
						Возраст
						<input type='text' {...register('age')} placeholder='Возраст' />
					</label>
					<label className='flex gap-2'>
						Здоровье
						<input type='text' {...register('health')} placeholder='Здоровье' />
					</label>
					<label className='flex gap-2'>
						характер
						<input
							type='text'
							{...register('character')}
							placeholder='характер'
						/>
					</label>
					<label className='flex gap-2'>
						Доп инфа
						<input type='text' {...register('extra')} placeholder='Доп инфа' />
					</label>
					<label className='flex gap-2'>
						Рост
						<input type='text' {...register('height')} placeholder='Рост' />
					</label>
					<label className='flex gap-2'>
						хобби
						<input type='text' {...register('hobby')} placeholder='хобби' />
					</label>
					<label className='flex gap-2'>
						Инвентарь
						<input
							type='text'
							{...register('inventory')}
							placeholder='Инвентарь'
						/>
					</label>
					<label className='flex gap-2'>
						Фобия
						<input type='text' {...register('phobia')} placeholder='Фобия' />
					</label>
					<label className='flex gap-2'>
						Профессия
						<input
							type='text'
							{...register('profession')}
							placeholder='Профессия'
						/>
					</label>
					<label className='flex gap-2'>
						Пол
						<input type='text' {...register('sex')} placeholder='Пол' />
					</label>
					<button type='submit'>Сохранить</button>
				</form>
			</div>
		</div>
	)
}
