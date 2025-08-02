import { Player } from '@/lib/generated/prisma-client'
import { queryClient } from '@/lib/query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'
import { createPlayer, deletePlayer, getPlayers, updatePlayer } from '../api'
import { colourStyles } from '../constants'
import {
	createCharacter,
	generateAge,
	generateCard,
	generateCharacter,
	generateExtra,
	generateHealth,
	generateHeight,
	generateHobby,
	generateInventory,
	generateNewPlayerData,
	generatePhobia,
	generateProfession,
	generateSex,
} from '../helpers'

type Characters =
	| 'Пол'
	| 'Возраст'
	| 'Профессия'
	| 'Здоровье'
	| 'Рост'
	| 'Фобия'
	| 'Хобби'
	| 'Инвентарь'
	| 'Характер'
	| 'Доп инфа'
	| 'Карточка 1'
	| 'Карточка 2'

const characters: Characters[] = [
	'Пол',
	'Возраст',
	'Профессия',
	'Здоровье',
	'Рост',
	'Фобия',
	'Хобби',
	'Инвентарь',
	'Характер',
	'Доп инфа',
	'Карточка 1',
	'Карточка 2',
]

const initialOption = { label: '', value: 0 }

export const PlayerForm = () => {
	const [selectedPlayer, setSelectedPlayer] = useState<{
		label: string
		value: number
	}>(initialOption)
	const [checkedChars, setChecketChars] = useState<Characters[]>([])

	const { data: players } = useQuery({
		queryKey: ['adminPlayer'],
		queryFn: getPlayers,
		refetchOnWindowFocus: true,
		refetchInterval: 10000,
	})

	const {
		register,
		handleSubmit,
		reset,
		setValue: setPlayerValue,
	} = useForm<Player>()

	const { mutate: mutatePlayer } = useMutation({
		mutationFn: updatePlayer,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['adminPlayer'] })
			toast.success('Данные успешно обновлены!')
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})
	const { mutate: mutateCreatePlayer } = useMutation({
		mutationFn: createPlayer,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['adminPlayer'] })
			toast.success('Данные успешно обновлены!')
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})
	const { mutate: mutateDeletePlayer } = useMutation({
		mutationFn: deletePlayer,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['adminPlayer'] })
			setSelectedPlayer(initialOption)
			toast.success('Данные успешно обновлены!')
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	const options = players?.map(player => ({
		label: player.name ?? '',
		value: player.id,
	}))

	const player = players?.find(p => p.id === selectedPlayer.value)

	const distributeRolesToAllPlayers = async () => {
		if (!players) return

		const updatedPlayers = players.map(player => generateNewPlayerData(player))

		toast
			.promise(Promise.all(updatedPlayers.map(p => updatePlayer(p))), {
				loading: 'Распределение ролей...',
				success: 'Все роли обновлены!',
				error: 'Ошибка при обновлении ролей.',
			})
			.then(() => {
				queryClient.refetchQueries({ queryKey: ['adminPlayer'] })
			})
	}

	useEffect(() => {
		if (players && players.length > 0) {
			setSelectedPlayer(prev =>
				prev.value === 0
					? { value: players[0]?.id, label: players[0]?.name ?? '' }
					: prev
			)
		}
	}, [players])

	useEffect(() => {
		if (player) {
			reset(player)
			setChecketChars((player.opened?.split(',') as Characters[]) ?? [])
		}
	}, [player])

	const generateChars = () => {
		const generatedCharacter = createCharacter()
		reset({ ...generatedCharacter, id: selectedPlayer.value })
		setChecketChars([])
	}

	const savePlayer = (formData: Player) => {
		mutatePlayer({ ...formData, opened: checkedChars.join(',') })
	}

	return (
		<div>
			<button
				className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 mb-4 rounded w-full'
				onClick={distributeRolesToAllPlayers}
			>
				Раздать роли всем игрокам
			</button>
			<div className='flex gap-4'>
				<button
					className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 mb-4 rounded'
					onClick={() => mutateCreatePlayer()}
				>
					Добавить игрока
				</button>
				<button
					className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 mb-4 rounded'
					onClick={generateChars}
				>
					Раздать роль
				</button>
				<button
					className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 mb-4 rounded'
					onClick={() => mutateDeletePlayer(selectedPlayer.value)}
				>
					Удалить игрока
				</button>
			</div>

			<Select
				value={selectedPlayer}
				onChange={option => {
					if (option)
						setSelectedPlayer(option as { label: string; value: number })
				}}
				options={options}
				styles={colourStyles}
			/>

			<form onSubmit={handleSubmit(savePlayer)} className='grid gap-4 p-4'>
				<label className='grid grid-cols-[180px_1fr] gap-2 items-center'>
					Имя
					<input
						className='bg-zinc-800 p-2 rounded w-full'
						type='text'
						{...register('name')}
						placeholder='Имя'
					/>
				</label>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Возраст
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('age')}
							placeholder='Возраст'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('age', generateAge(player?.sex ?? ''))
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Здоровье
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('health')}
							placeholder='Здоровье'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('health', generateHealth())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Характер
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('character')}
							placeholder='Характер'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('character', generateCharacter())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Доп инфа
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('extra')}
							placeholder='Доп инфа'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('extra', generateExtra())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Рост
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('height')}
							placeholder='Рост'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('height', generateHeight())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Хобби
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('hobby')}
							placeholder='Хобби'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('hobby', generateHobby())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Инвентарь
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('inventory')}
							placeholder='Инвентарь'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('inventory', generateInventory())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Фобия
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('phobia')}
							placeholder='Фобия'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('phobia', generatePhobia())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Профессия
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('profession')}
							placeholder='Профессия'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue(
								'profession',
								generateProfession(player?.age ?? '20 ')
							)
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Пол
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('sex')}
							placeholder='Пол'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('sex', generateSex())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Карточка 1
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('card1')}
							placeholder='Карточка 1'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('card1', generateCard())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
					<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
						Карточка 2
						<input
							className='bg-zinc-800 p-2 rounded w-full'
							type='text'
							{...register('card2')}
							placeholder='Карточка 2'
						/>
					</label>
					<button
						onClick={() => {
							setPlayerValue('card2', generateCard())
						}}
						className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
					>
						Пересоздать
					</button>
				</div>
				{characters.map((character, i) => (
					<label
						className='grid grid-cols-[1fr_auto] gap-2 items-center'
						key={i}
					>
						{character}
						<input
							type='checkbox'
							checked={checkedChars.includes(character)}
							onChange={() =>
								checkedChars.includes(character)
									? setChecketChars(prev =>
											prev.filter(char => char !== character)
									  )
									: setChecketChars(prev => [...prev, character])
							}
						/>
					</label>
				))}
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
