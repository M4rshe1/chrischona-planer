const {PrismaClient, SiteRole, RelationRoleLocation} = require('@prisma/client');
const {hash} = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const users = [
        {
            email: 'colin.heggli@gmail.com',
            name: 'Colin Heggli',
            password: await hash('password', 10),
            role: SiteRole.ADMIN,
        },
        {
            email: 'martin.schwaning@gmail.com',
            name: 'Martin Schwaning',
            password: await hash('password', 10),
            role: SiteRole.USER,
        },
        {
            email: 'milean.selemba@gmail.com',
            name: 'Milean Selemba',
            password: await hash('password', 10),
            role: SiteRole.USER,
        },
        {
            email: 'rolf.sen@gmail.com',
            name: 'Rolf Sen',
            password: await hash('password', 10),
            role: SiteRole.USER,
        },
        {
            email: 'ruth.hallauer@gmail.com',
            name: 'Ruth Hallauer',
            password: await hash('password', 10),
            role: SiteRole.USER,
        },
        {
            email: 'andy.vogeli@gmail.com',
            name: 'Andy Vögeli',
            password: await hash('password', 10),
            role: SiteRole.USER,
        },
        {
            email: 'susanne.bosshard@gmail.com',
            name: 'Susanne Bosshard',
            password: await hash('password', 10),
            role: SiteRole.USER,
        }
    ];

    const locations = [
        {
            name: 'Chrischona Beringen',
            address: 'St. Chrischonastrasse 1, 8222 Beringen',
            Users: {
                create: [
                    {
                        user: {connect: {email: 'colin.heggli@gmail.com'}},
                        relation: RelationRoleLocation.TEAMMEMBER
                    },
                    {
                        user: {connect: {email: 'martin.schwaning@gmail.com'}},
                        relation: RelationRoleLocation.MANAGER
                    },
                    {
                        user: {connect: {email: 'milean.selemba@gmail.com'}},
                        relation: RelationRoleLocation.OWNER
                    },
                    {
                        user: {connect: {email: 'ruth.hallauer@gmail.com'}},
                        relation: RelationRoleLocation.TEAMMEMBER
                    },
                    {
                        user: {connect: {email: 'andy.vogeli@gmail.com'}},
                        relation: RelationRoleLocation.TEAMMEMBER
                    },
                    {
                        user: {connect: {email: 'susanne.bosshard@gmail.com'}},
                        relation: RelationRoleLocation.TEAMMEMBER
                    },
                ]
            },
        },
        {
            name: 'Chrischona Schauffhausen',
            address: 'St. Chrischonastrasse 1, 8200 Schaffhausen',
            Users: {
                create: [
                    {
                        user: {connect: {email: 'rolf.sen@gmail.com'}},
                        relation: RelationRoleLocation.OWNER
                    },
                ]
            }
        },
    ];

    for (const user of users) {
        const created = await prisma.user.upsert({
            where: {email: user.email},
            update: {},
            create: user
        });
        console.log('Created user:', created);
    }

    for (const location of locations) {
        const created = await prisma.location.upsert({
            where: {name: location.name},
            update: {},
            create: location
        });
        console.log('Created location:', created);
    }
    const dbLocations = await prisma.location.findMany();


    for (const location of dbLocations) {
        for (const teamName of ['TECHNIK_BILD', 'TECHNIK_TON', 'TECHNIK_STREAM', 'PREDIGER', 'MODERATOR', 'MUSIK', 'KINDERHUTE', 'KINDERTREFF', 'TEENETALK', 'BISTRO', 'PUTZTEAM', 'TEAM']) {
            const created = await prisma.team.upsert({
                where: {
                    name_locationId: teamName + '_' + location.id
                },
                update: {},
                create: {
                    name: teamName,
                    name_locationId: teamName + '_' + location.id,
                    location: { connect: { id: location.id } }
                }
            });
            console.log('Created team:', created);
        }
    }

}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
