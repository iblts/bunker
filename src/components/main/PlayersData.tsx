import { queryClient } from '@/lib/query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { RefreshCcw } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getPlayers, getRound, updatePlayer, updateRound } from '../../api'
import { getNoun, playerDto } from '../../helpers'

export const PlayersData = ({ userId }: { userId: number }) => {
	const [canRefetch, setCanRefetch] = useState(true)

	const {
		data: playersData,
		refetch: refetchPlayers,
		isPending: isPendingPlayers,
	} = useQuery({
		queryKey: ['player'],
		queryFn: getPlayers,
		refetchInterval: 5000,
		refetchOnWindowFocus: false,
	})
	const {
		data: round,
		refetch: refetchRound,
		isPending: isPendingRound,
	} = useQuery({
		queryKey: ['round'],
		queryFn: getRound,
		refetchInterval: 10000,
		refetchOnWindowFocus: false,
	})

	const players = playersData?.map(playerDto)

	const currentPlayer = useMemo(
		() => players?.find(player => player.id === userId),
		[players, userId]
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
		onSuccess: updatedRound => {
			queryClient.setQueryData(['round'], updatedRound)
			if (
				updatedRound &&
				updatedRound.activePlayer === userId &&
				updatedRound.isStarted
			) {
				const stepsLeft =
					updatedRound.mustOpen - updatedRound.activePlayerOpened
				toast.success(
					`У вас ${getNoun(
						stepsLeft,
						'остался',
						'осталось',
						'осталось'
					)} ${stepsLeft} ${getNoun(stepsLeft, 'ход', 'хода', 'ходов')}`
				)
			}
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
	})

	const canOpenCharacteristic = (characteristicKey?: string) => {
		if (characteristicKey?.includes('Карточка')) return true

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
		if (!currentPlayer || !round || !canOpenCharacteristic(characteristic))
			return

		const openedSet = new Set(currentPlayer?.opened)
		if (openedSet.has(characteristic)) return

		const updatedOpened = [...openedSet, characteristic].join(',') + ','

		mutateUpdatePlayer({
			id: userId,
			opened: updatedOpened,
		})

		if (!characteristic.includes('Карточка')) {
			const activePlayerOpened = round?.activePlayerOpened
				? round.activePlayerOpened === round.mustOpen
					? 0
					: round?.activePlayerOpened + 1
				: 1

			mutateUpdateRound({
				...round,
				activePlayerOpened,
				isStarted: activePlayerOpened < round.mustOpen,
			})
		}
	}

	useEffect(() => {
		if (
			round &&
			round.activePlayer === userId &&
			round.activePlayerOpened === 0 &&
			round.isStarted
		) {
			toast.success('Ваш ход!')
		}
	}, [round])

	const handleRefetch = () => {
		Promise.all([refetchPlayers(), refetchRound()]).then(() =>
			toast.success('Данные обновлены!')
		)
		setCanRefetch(false)
		const timer = setTimeout(() => {
			setCanRefetch(true)
		}, 15000)

		return () => clearTimeout(timer)
	}

	return (
		<div
			className='grid gap-4 relative'
			style={{
				gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
				marginTop: 16,
			}}
		>
			<button
				className='fixed top-4 right-4 p-2 bg-zinc-700 hover:bg-zinc-600 duration-300 rounded disabled:text-zinc-500 disabled:pointer-events-none'
				disabled={!canRefetch || isPendingRound || isPendingPlayers}
				onClick={handleRefetch}
			>
				<RefreshCcw className={canRefetch ? '' : 'spinner'} />
			</button>
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
											disabled={!canOpenCharacteristic(char.key)}
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
