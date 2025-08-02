import { QueryProvider } from '@/lib/query'
import { Montserrat } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata = {
	title: 'Бункер',
	description: 'Бункер',
}

const montserrat = Montserrat({
	subsets: ['cyrillic', 'latin'],
	weight: ['500', '700'],
})

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='ru' className='h-full'>
			<body className={`h-full ${montserrat.className}`}>
				<QueryProvider>
					<Toaster />
					<div className='min-h-screen flex flex-col'>
						<main className='flex-1 overflow-auto'>{children}</main>
					</div>
				</QueryProvider>
			</body>
		</html>
	)
}
