import { useQuery } from '@tanstack/react-query'
import { getData } from '../api'

export const BunkerData = () => {
	const { data: data } = useQuery({
		queryKey: ['data'],
		queryFn: getData,
		refetchInterval: 30000,
		refetchOnWindowFocus: false,
	})

	return (
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
	)
}
