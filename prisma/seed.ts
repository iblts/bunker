import { PrismaClient } from '../lib/generated/prisma-client'

const prisma = new PrismaClient()

async function main() {
	// Create 5 users
	await prisma.user.createMany({
		data: [
			{ email: 'alice@example.com', name: 'Alice' },
			{ email: 'bob@example.com', name: 'Bob' },
			{ email: 'charlie@example.com', name: 'Charlie' },
			{ email: 'diana@example.com', name: 'Diana' },
			{ email: 'edward@example.com', name: 'Edward' },
		],
	})

	// Find all users to get their IDs
	const userRecords = await prisma.user.findMany()

	const userIdMapping = {
		alice: userRecords.find(user => user.email === 'alice@example.com')?.id,
		bob: userRecords.find(user => user.email === 'bob@example.com')?.id,
		charlie: userRecords.find(user => user.email === 'charlie@example.com')?.id,
		diana: userRecords.find(user => user.email === 'diana@example.com')?.id,
		edward: userRecords.find(user => user.email === 'edward@example.com')?.id,
	}

	console.log('Seeding completed.')
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
