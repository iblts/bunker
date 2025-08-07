import { queryClient } from '@/lib/query'
import { getPlayers, swapEverobodyChars, swapPlayerChars } from '@/src/api'
import {
	CHARACTERISTICS_OPTIONS,
	initialOption,
	selectStyles,
} from '@/src/constants'
import { playerToOptionDto } from '@/src/helpers'
import type { Option, PlayerCharacteristics, SwapCharsBody } from '@/src/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'

export const SwapForm = () => {
	const [selectedCharacteristic, setSelectedCharacteristic] = useState<
		Option<keyof PlayerCharacteristics | ''>
	>(CHARACTERISTICS_OPTIONS[0])
	const { reset, getValues, handleSubmit, setValue, watch } =
		useForm<SwapCharsBody>({
			defaultValues: {
				characteristic: 'health',
				player1: 0,
				player2: 0,
			},
		})

	const activePlayer1Id = watch('player1')
	const activePlayer2Id = watch('player2')
	const activeCharacteristic = watch('characteristic')

	const { data: players } = useQuery({
		queryKey: ['adminPlayer'],
		queryFn: getPlayers,
	})

	const playersOptions = useMemo(
		() => players?.map(playerToOptionDto),
		[players]
	)

	const { mutateAsync, isPending } = useMutation({
		mutationFn: swapPlayerChars,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['adminPlayer'] })
			toast.success('Данные успешно обновлены!')
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	const { mutateAsync: swapAll, isPending: isSwappingAll } = useMutation({
		mutationFn: swapEverobodyChars,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['adminPlayer'] })
			toast.success('Данные успешно обновлены!')
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	useEffect(() => {
		const player1 = players?.[0]?.id
		const player2 = players?.[1]?.id
		reset({
			player1,
			player2,
			characteristic: getValues('characteristic'),
		})
	}, [players, reset])

	const onSubmit = (formData: SwapCharsBody) => {
		mutateAsync(formData)
	}

	const handleSwapAll = () => {
		if (!selectedCharacteristic.value) return
		swapAll({ characteristic: selectedCharacteristic.value })
	}

	return (
		<div>
			<form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
				<h2 className='text-2xl'>Обмен характеристикой</h2>
				<label className='grid gap-1 items-center'>
					Игрок 1
					<Select<Option>
						onChange={option => setValue('player1', option ? +option.value : 0)}
						value={
							playersOptions?.find(
								option => +option.value === activePlayer1Id
							) ?? initialOption
						}
						options={playersOptions?.filter(
							option => +option.value !== activePlayer2Id
						)}
						styles={selectStyles}
					/>
				</label>
				<label className='grid gap-1 items-center'>
					Игрок 2
					<Select<Option>
						onChange={option => setValue('player2', option ? +option.value : 0)}
						value={
							playersOptions?.find(
								option => +option.value === activePlayer2Id
							) ?? initialOption
						}
						options={playersOptions?.filter(
							option => +option.value !== activePlayer1Id
						)}
						styles={selectStyles}
					/>
				</label>
				<label className='grid gap-1 items-center'>
					Характеристика
					<Select<Option>
						onChange={option =>
							setValue(
								'characteristic',
								(option?.value as keyof PlayerCharacteristics) ?? 'health'
							)
						}
						value={
							CHARACTERISTICS_OPTIONS?.find(
								option => option.value === activeCharacteristic
							) ?? { label: '', value: '' }
						}
						options={CHARACTERISTICS_OPTIONS}
						styles={selectStyles}
					/>
				</label>
				<button
					type='submit'
					className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded disabled:text-zinc-500 disabled:pointer-events-none w-full'
					disabled={isPending}
				>
					Обменять
				</button>
			</form>
			<h2 className='text-2xl mt-6 mb-2'>Обмен характеристиками</h2>
			<label className='grid gap-1 items-center mb-4'>
				Характеристика
				<Select<Option<keyof PlayerCharacteristics | ''>>
					onChange={option =>
						setSelectedCharacteristic(option ?? initialOption)
					}
					value={selectedCharacteristic}
					options={CHARACTERISTICS_OPTIONS}
					styles={selectStyles}
				/>
			</label>
			<button
				onClick={handleSwapAll}
				className='uppercase block px-4 py-2 bg-zinc-800 hover:bg-zinc-600 duration-300 mb-4 rounded w-full disabled:text-zinc-500 disabled:pointer-events-none'
				disabled={isSwappingAll}
			>
				Обмен {selectedCharacteristic.label} слева направо
			</button>
		</div>
	)
}
