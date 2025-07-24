'use client'
import { getData, getPlayers } from '@/api'
import { useQuery } from '@tanstack/react-query'

export default function Home() {
	const { data: players } = useQuery({
		queryKey: ['player'],
		queryFn: getPlayers,
		refetchInterval: 1000,
	})

	const { data: data } = useQuery({
		queryKey: ['data'],
		queryFn: getData,
		refetchInterval: 1000,
	})

	return (
		<div className='min-h-screen bg-black-50 flex flex-col p-8'>
			<div className='m-8'>
				<p className='bg-zinc-800 p-4 rounded-lg'>
					Расположение бункера: {data?.place}
					<br />
					Размер: {data?.size}
					<br />
					Время в бункере: {data?.time}
					<br />
					Запасы в бункере: {data?.food}
					<br />
					Комнаты: {data?.rooms}
					<br />
					Катастрофа: {data?.problem}
					<br />
				</p>
			</div>
			<div className='flex gap-10'>
				{players?.map(player => (
					<p className='bg-zinc-800 p-4 rounded-lg' key={player.id}>
						Имя: {player?.name}
						<br />
						Пол: {player?.sex}
						<br />
						Профессия: {player?.profession}
						<br />
						Здоровье: {player?.health}
						<br />
						Возраст: {player?.age}
						<br />
						Рост: {player?.height}
						<br />
						характер: {player?.character}
						<br />
						Доп инфа: {player?.extra}
						<br />
						хобби: {player?.hobby}
						<br />
						Инвентарь: {player?.inventory}
						<br />
						Фобия: {player?.phobia}
					</p>
				))}
			</div>
		</div>
	)
}
