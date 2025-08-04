import type { Round } from '@/lib/generated/prisma-client'
import { queryClient } from '@/lib/query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'
import { getPlayers, getRound, updateRound } from '../../api'
import { selectStyles } from '../../constants'
import { Option } from '../../types'

type RoundFormFields = Pick<Round, 'mustOpen' | 'activePlayer'>

export const RoundForm = () => {
	const [isStarted, setStarted] = useState(false)

	const { data: round } = useQuery({
		queryKey: ['adminRound'],
		queryFn: getRound,
		refetchOnWindowFocus: true,
		refetchInterval: 30000,
	})

	const { data: players } = useQuery({
		queryKey: ['adminPlayer'],
		queryFn: getPlayers,
		refetchOnWindowFocus: false,
		refetchInterval: 100000,
		initialData: [],
	})

	const { register, handleSubmit, reset, getValues, setValue, watch } =
		useForm<RoundFormFields>()

	const selectedPlayerId = watch('activePlayer')

	const { mutate: mutateRound } = useMutation({
		mutationFn: updateRound,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['adminPlayer'] })
			queryClient.refetchQueries({ queryKey: ['adminRound'] })
			toast.success('Данные успешно обновлены!')
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	useEffect(() => {
		if (round) {
			reset({
				mustOpen: round.mustOpen,
				activePlayer: round.activePlayer ?? players[0]?.id ?? 0,
			})
			setStarted(round.isStarted)
		}
	}, [round, players, reset])

	const options: Option[] = players.map(player => ({
		label: player.name ?? '',
		value: String(player.id),
	}))

	const onSubmit = (formData: RoundFormFields) => {
		mutateRound({
			...round,
			...formData,
			isStarted,
		})
	}

	const handleStart = () => {
		const form = getValues()
		mutateRound({
			...round,
			...form,
			isStarted: true,
			activePlayerOpened: 0,
		})
		setStarted(true)
	}

	const handleStop = () => {
		const form = getValues()
		mutateRound({
			...round,
			...form,
			isStarted: false,
			activePlayerOpened: 0,
		})
		setStarted(false)
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
				<h2 className='text-2xl'>Раунд</h2>
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
					<Select<Option>
						value={
							options.find(option => +option.value === selectedPlayerId) ?? null
						}
						onChange={option =>
							option && setValue('activePlayer', +option.value)
						}
						options={options}
						styles={selectStyles}
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
