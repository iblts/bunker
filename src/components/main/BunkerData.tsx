import { getData } from '@/src/api'
import { useQuery } from '@tanstack/react-query'
import { RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const BunkerData = () => {
	const [canRefetch, setCanRefetch] = useState(true)
	const {
		data: data,
		refetch,
		isPending,
	} = useQuery({
		queryKey: ['data'],
		queryFn: getData,
		refetchInterval: 60000,
		refetchOnWindowFocus: false,
	})

	const handleRefetch = () => {
		refetch().then(() => toast.success('Данные обновлены!'))
		setCanRefetch(false)
		const timer = setTimeout(() => {
			setCanRefetch(true)
		}, 15000)

		return () => clearTimeout(timer)
	}

	return (
		<p className='bg-zinc-800 p-4 rounded-lg relative'>
			<button
				className='absolute top-4 right-4 p-2 bg-zinc-700 hover:bg-zinc-600 duration-300 rounded disabled:text-zinc-500 disabled:pointer-events-none'
				disabled={!canRefetch || isPending}
				onClick={handleRefetch}
			>
				<RefreshCcw className={canRefetch ? '' : 'spinner'} />
			</button>
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
