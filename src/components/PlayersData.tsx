import { queryClient } from '@/lib/query'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import toast from 'react-hot-toast'
import { getPlayers, getRound, updatePlayer, updateRound } from '../api'
import { playerDto } from '../helpers'

export const PlayersData = ({ userId }: { userId: number }) => {
	const { data: playersData } = useQuery({
		queryKey: ['player'],
		queryFn: getPlayers,
		refetchInterval: 15000,
		refetchOnWindowFocus: false,
	})

	const { data: round } = useQuery({
		queryKey: ['round'],
		queryFn: getRound,
		refetchInterval: 10000,
		refetchOnWindowFocus: false,
	})

	const players = playersData?.map(playerDto)

	const currentPlayer = useMemo(
		() => players?.find(player => player.id === userId),
		[playersData]
	)

	const { mutate: mutateUpdatePlayer, isPending: isPlayerLoading } =
		useMutation({
			mutationFn: updatePlayer,
			onSuccess: () => {
				queryClient.refetchQueries({ queryKey: ['player'] }),
					toast.success('Данные успешно обновлены!')
			},
			onError: (error: Error) => {
				toast.error(error.message)
			},
		})

	const { mutate: mutateUpdateRound, isPending: isRoundLoading } = useMutation({
		mutationFn: updateRound,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['round'] })
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	const canOpenCharacteristic = () => {
		if (!round || !currentPlayer || isPlayerLoading || isRoundLoading) {
			return false
		}
		return (
			round.isStarted &&
			round.activePlayer === userId &&
			round.activePlayerOpened < round.mustOpen
		)
	}

	const openCharacteristic = (characteristic: string) => {
		if (!currentPlayer || !round || !canOpenCharacteristic()) return

		const openedSet = new Set(currentPlayer.opened)
		if (openedSet.has(characteristic)) return // уже открыто

		const updatedOpened = [...openedSet, characteristic].join(',') + ','

		mutateUpdatePlayer({
			id: userId,
			opened: updatedOpened,
		})

		mutateUpdateRound({
			...round,
			activePlayerOpened: round.activePlayerOpened + 1,
		})
	}

	return (
		<div
			className='grid gap-4'
			style={{
				gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
				marginTop: 16,
			}}
		>
			{players
				?.sort((p1, p2) => p1.id - p2.id)
				.map(player => {
					const opened = new Set(player.opened)

					return (
						<div
							className='bg-zinc-800 p-4 rounded-lg grid grid-cols-[auto_1fr] gap-x-8 gap-y-2'
							key={player.id}
						>
							<span className='font-bold'>Имя</span>
							<span>{player.name}</span>
							{player.characteristics.map(char => (
								<React.Fragment key={char.key}>
									<span className='font-bold self-center'>{char.key}</span>
									{userId === player.id && !opened.has(char.key) ? (
										<button
											disabled={!canOpenCharacteristic()}
											className='text-left bg-zinc-700 p-2 rounded hover:bg-zinc-600 disabled:bg-zinc-700 disabled:text-gray-300 duration-300'
											onClick={() => openCharacteristic(char.key)}
										>
											{char.value}
										</button>
									) : (
										<span className='flex justify-between my-2'>
											{opened.has(char.key) ? char.value : '-'}
										</span>
									)}
								</React.Fragment>
							))}
						</div>
					)
				})}
		</div>
	)
}
