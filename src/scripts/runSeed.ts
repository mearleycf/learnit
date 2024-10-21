import seed from '@db/seed'

export default async function () {
  try {
    await seed()
    console.log('Seeding completed successfully')
  } catch (error) {
    console.error('Error during seeding:', error)
  }
}
