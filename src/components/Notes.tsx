import { useEffect, useState } from 'react'

export const Notes = () => {
	const [text, setText] = useState('')

	useEffect(() => {
		setText(localStorage.getItem('text') ?? '')
	}, [])

	const onEditText = (v: string) => {
		setText(v)
		localStorage.setItem('text', v)
	}

	return (
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
	)
}
