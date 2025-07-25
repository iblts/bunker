'use client'
import { getData, getPlayers } from '@/api'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default function Home() {
	const { data: players } = useQuery({
		queryKey: ['player'],
		queryFn: getPlayers,
		refetchInterval: 10000,
	})

	const { data: data } = useQuery({
		queryKey: ['data'],
		queryFn: getData,
		refetchInterval: 10000,
	})

	const [text, setText] = useState('')

	useEffect(() => {
		setText(localStorage.getItem('text') ?? '')
	}, [])

	const onEditText = (v: string) => {
		setText(v)
		localStorage.setItem('text', v)
	}

	return (
		<div className='min-h-screen bg-black-50 flex flex-col p-8'>
			<div className='mb-8'>
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
					Доп инфа: {data?.extra}
				</p>
			</div>
			<div
				className='grid gap-10'
				style={{
					gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
				}}
			>
				{players
					?.sort((p1, p2) => p1.id - p2.id)
					.map(player => (
						<div
							className='bg-zinc-800 p-4 rounded-lg grid grid-cols-[auto_1fr] gap-x-8 gap-y-2'
							key={player.id}
						>
							<span className='font-bold'>Имя</span>
							<span>{player?.name || '-'}</span>
							<span className='font-bold'>Пол</span>
							<span>{player?.sex || '-'}</span>
							<span className='font-bold'>Профессия</span>
							<span>{player?.profession || '-'}</span>
							<span className='font-bold'>Здоровье</span>
							<span>{player?.health || '-'}</span>
							<span className='font-bold'>Возраст</span>
							<span>{player?.age || '-'}</span>
							<span className='font-bold'>Рост</span>
							<span>{player?.height || '-'}</span>
							<span className='font-bold'>Характер</span>
							<span>{player?.character || '-'}</span>
							<span className='font-bold'>Доп инфа</span>
							<span>{player?.extra || '-'}</span>
							<span className='font-bold'>Хобби</span>
							<span>{player?.hobby || '-'}</span>
							<span className='font-bold'>Инвентарь</span>
							<span>{player?.inventory || '-'}</span>
							<span className='font-bold'>Фобия</span>
							<span>{player?.phobia || '-'}</span>
						</div>
					))}
			</div>
			<label className='grid gap-2 mt-4'>
				Заметки
				<textarea
					name='notes'
					id='notes'
					className='bg-zinc-800 rounded-lg p-2 h-[300px]'
					value={text}
					onChange={e => {
						onEditText(e.target.value)
					}}
				></textarea>
			</label>
		</div>
	)
}
