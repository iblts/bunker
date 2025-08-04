import type { Data } from '@/lib/generated/prisma-client'

interface GeneratedInputProps {
	label: string
	placeholder: string
	valueName: keyof Omit<Data, 'id'>
	register: ReturnType<
		typeof import('react-hook-form').useForm<Omit<Data, 'id'>>
	>['register']
	onGenerate?: () => void
	isTextarea?: boolean
}

export const GeneratedInput = ({
	label,
	placeholder,
	valueName,
	register,
	onGenerate,
	isTextarea,
}: GeneratedInputProps) => {
	return (
		<div className='grid grid-cols-[1fr_142px] gap-2 items-center'>
			<label className='grid grid-cols-[1fr_auto] gap-2 items-center'>
				{label}
				{isTextarea ? (
					<textarea
						className='bg-zinc-800 p-2 rounded w-full'
						{...register(valueName)}
						placeholder={placeholder}
					/>
				) : (
					<input
						className='bg-zinc-800 p-2 rounded w-full'
						type='text'
						{...register(valueName)}
						placeholder={placeholder}
					/>
				)}
			</label>
			{onGenerate && (
				<button
					type='button'
					onClick={onGenerate}
					className='px-4 py-3 bg-zinc-800 hover:bg-zinc-600 duration-300 rounded'
				>
					Пересоздать
				</button>
			)}
		</div>
	)
}
