import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Reset Database
    await prisma.user.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.certificateTemplate.deleteMany({});

    // Admin Seeding
    await prisma.user.create({
      data: {
        username: 'admin1',
        email: 'admin1@example.com',
        hashed_password: '$2a$10$VJD8MgmngLurQb0pGw.xLupWNtsT85bfBuddnnLG3qISqqmnPxFIu',  // pass: admin
        php_id: 1,
        tipe: 0,
        status: Status.ACCEPTED,
      },
    });

    // Pengajar Seeding
    let startId = 1, lastId = 3;

    const userId: string[] = [];
    for (let i = startId; i <= lastId; i++) {
      const user = await prisma.user.create({
        data: {
          username: `dosen${i}`,
          email: `dosen${i}@example.com`,
          hashed_password: '$2a$10$Z3TcaW5X3DToRQyfbalRFeE5Gj1Q/Wl6BjzFcfu/ejTazNnaY8XO2',  // pass: dosen
          php_id: i + 5,
          tipe: 1,
        },
      });

      userId[i] = user.id;
    }

    // Course Seeding
    const courseData = [
      {
        kode: 'IF1300',
        user_id: userId[1],
      },
      {
        kode: 'IF1335',
        user_id: userId[1],
      },
      {
        kode: 'IF1305',
        user_id: userId[2],
      },
      {
        kode: 'IF1345',
        user_id: userId[2],
      },
      {
        kode: 'IF1325',
        user_id: userId[3],
      },
      {
        kode: 'IF1380',
        user_id: userId[3],
      },
    ]

    for (const data of courseData) {
      await prisma.course.create({
        data: data,
      });
    }

    // Template Seeding
    // TODO: Add template seeding
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }

  return;
}

main();
