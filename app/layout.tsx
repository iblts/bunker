// app/layout.tsx
import { QueryProvider } from '@/lib/query'
import './globals.css'

export const metadata = {
	title: 'Superblog',
	description: 'A blog app using Next.js and Prisma',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' className='h-full'>
			<body className='h-full overflow-hidden'>
				<QueryProvider>
					<div className='min-h-screen flex flex-col'>
						<main className='flex-1 overflow-auto'>{children}</main>
					</div>
				</QueryProvider>
			</body>
		</html>
	)
}
