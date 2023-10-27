import { PrismaClient } from "@prisma/client";

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
        hashed_password: '$2a$10$VJD8MgmngLurQb0pGw.xLupWNtsT85bfBuddnnLG3qISqqmnPxFIu',  // pass: admin
        php_id: 1,
        tipe: 0,
      },
    });

    // Pengajar Seeding
    let startId = 6, lastId = 8;

    const userId: string[] = [];
    for (let i = startId; i <= lastId; i++) {
      const user = await prisma.user.create({
        data: {
          hashed_password: '$2a$10$Z3TcaW5X3DToRQyfbalRFeE5Gj1Q/Wl6BjzFcfu/ejTazNnaY8XO2',  // pass: dosen
          php_id: i,
          tipe: 1,
        },
      });

      userId[i] = user.id;
    }

    // Course Seeding
    const courseData = [
      {
        kode: 'IF1300',
        user_id: userId[6],
      },
      {
        kode: 'IF1335',
        user_id: userId[6],
      },
      {
        kode: 'IF1305',
        user_id: userId[7],
      },
      {
        kode: 'IF1345',
        user_id: userId[7],
      },
      {
        kode: 'IF1325',
        user_id: userId[8],
      },
      {
        kode: 'IF1380',
        user_id: userId[8],
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
