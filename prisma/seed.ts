const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient()

async function main() {
    const users = [
        {
            email: 'colin.heggli@gmail.com',
            name: 'Colin Heggli',
            password: await hash('password', 10),
            role: 'ADMIN',
            locationRole : 'TEAMMEMBER'
        },
        {
            email: 'martin.schwaning@gmail.com',
            name: 'Martin Schwaning',
            password: await hash('password', 10),
            role: 'USER',
            locationRole: 'MANAGER'
        },
        {
            email: 'milean.selemba@gmail.com',
            name: 'Milean Selemba',
            password: await hash('password', 10),
            role: 'USER',
            locationRole: 'OWNER'
        },
        {
            email: 'rolf.sen@gmail.com',
            name: 'Rolf Sen',
            password: await hash('password', 10),
            role: 'USER',
            LocationRole: 'OWNER'
        }
    ]
    const locations = [
        {
            name: 'Chrischona Beringen',
            address: 'St. Chrischonastrasse 1, 8222 Beringen',
            users: {
                connect: [
                    {email: 'colin.heggli@gmail.com'},
                    {email: 'martin.schwaninger@gmail.com'},
                    {email: 'milena.selemba@georgfischer.com'}
                ]
            }
        },
        {
            name: 'Chrischona Schauffhausen',
            address: 'St. Chrischonastrasse 1, 8200 Schaffhausen',
            users: {
                connect: [
                    {email: 'rofl.sen@gmail.com'}
                ]
            }
        },
    ]

    for (const user of users) {
        const created = await prisma.user.upsert({
            where: {email: user.email},
            update: {},
            create: user
        })
        console.log(created)
    }

    for (const location of locations) {
        const created = await prisma.location.upsert({
            where: {name: location.name},
            update: {},
            create: location
        })
        console.log(created)
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })