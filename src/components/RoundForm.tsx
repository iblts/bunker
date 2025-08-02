import type { Round } from '@/lib/generated/prisma-client'
import { queryClient } from '@/lib/query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'
import { getPlayers, getRound, updateRound } from '../api'
import { colourStyles } from '../constants'

const initialOption = { label: '', value: 0 }

export const RoundForm = () => {
	const [selectedPlayer, setSelectedPlayer] = useState<{
		label: string
		value: number
	}>(initialOption)
	const [isStarted, setStarted] = useState(false)

	const { data: round } = useQuery({
		queryKey: ['adminRound'],
		queryFn: getRound,
		refetchOnWindowFocus: false,
		refetchInterval: 100000,
	})

	const { data: players } = useQuery({
		queryKey: ['adminPlayer'],
		queryFn: getPlayers,
		refetchOnWindowFocus: false,
		refetchInterval: 100000,
	})

	const { mutate: mutateRound } = useMutation({
		mutationFn: updateRound,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['adminPlayer'] })
			queryClient.refetchQueries({ queryKey: ['adminRound'] })
			setSelectedPlayer(initialOption)
			toast.success('Данные успешно обновлены!')
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	const { register, handleSubmit, reset, getValues } =
		useForm<Pick<Round, 'mustOpen'>>()

	useEffect(() => {
		if (players && players.length > 0) {
			setSelectedPlayer({
				value: players[0]?.id ?? 0,
				label: players[0]?.name ?? '',
			})
		}
	}, [players])

	useEffect(() => {
		if (round) {
			reset({ mustOpen: round.mustOpen })
			setStarted(round.isStarted)
			setSelectedPlayer({
				value: round.activePlayer ?? 0,
				label:
					players?.find(player => player.id === round.activePlayer)?.name ?? '',
			})
		}
	}, [round, reset])

	const options = players?.map(player => ({
		label: player.name,
		value: player.id,
	}))

	const onSubmit = (formData: Pick<Round, 'mustOpen'>) => {
		mutateRound({
			...round,
			...formData,
			activePlayer: selectedPlayer.value,
			isStarted,
		})
	}

	const handleStart = () => {
		const { mustOpen } = getValues()
		mutateRound({
			...round,
			mustOpen,
			isStarted: true,
			activePlayer: selectedPlayer.value,
			activePlayerOpened: 0,
		})
		setStarted(true)
	}

	const handleStop = () => {
		const { mustOpen } = getValues()
		mutateRound({
			...round,
			mustOpen,
			isStarted: false,
			activePlayer: selectedPlayer.value,
			activePlayerOpened: 0,
		})
		setStarted(false)
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
				<label className='grid grid-cols-[auto_350px] gap-2 items-center w-full'>
					Количество характеристик
					<input
						className='bg-zinc-800 p-2 rounded w-full'
						type='number'
						min={1}
						max={10}
						{...register('mustOpen', { valueAsNumber: true })}
						placeholder='Количество характеристик'
					/>
				</label>
				<label className='grid grid-cols-[auto_350px] gap-2 items-center w-full'>
					Игрок
					<Select
						value={selectedPlayer}
						onChange={option => {
							if (option)
								setSelectedPlayer(option as { label: string; value: number })
						}}
						options={options}
						styles={colourStyles}
					/>
				</label>
				<div className='flex gap-4'>
					<button
						type='button'
						className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded disabled:text-zinc-500 disabled:pointer-events-none w-full'
						onClick={handleStart}
						disabled={isStarted}
					>
						Старт
					</button>
					<button
						type='button'
						className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded disabled:text-zinc-500 disabled:pointer-events-none w-full'
						onClick={handleStop}
						disabled={!isStarted}
					>
						Стоп
					</button>
				</div>
			</form>
		</div>
	)
}
