import { getData } from '@/src/api'
import { useQuery } from '@tanstack/react-query'

export const BunkerData = () => {
	const { data: data } = useQuery({
		queryKey: ['data'],
		queryFn: getData,
		refetchInterval: 60000,
		refetchOnWindowFocus: false,
	})

	return (
		<p className='bg-zinc-800 p-4 rounded-lg relative'>
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
