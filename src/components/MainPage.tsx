'use client'

import { BunkerData } from './BunkerData'
import { Notes } from './Notes'
import { PlayersData } from './PlayersData'

export const MainPage = ({ userId }: { userId: number }) => {
	return (
		<div
			className='min-h-screen bg-black-50 flex flex-col'
			style={{ padding: 24 }}
		>
			<BunkerData />
			<PlayersData userId={userId} />
			<Notes />
		</div>
	)
}
