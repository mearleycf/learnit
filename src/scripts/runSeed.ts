import { seedDb } from '@db/seed'

export default async function () {
  try {
    await seedDb()
    console.log('Seeding completed successfully')
  } catch (error) {
    console.error('Error during seeding:', error)
  }
}
