import { ITEMS_PER_PAGE } from "../config";
import { Request, Response } from "express";
import prisma from "../utils/db";

interface ICourseData {
  id: string;
  kode: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

interface ICourseFullData {
  id: string;
  kode: string;
  user_id: string;
  nama: string;
  deskripsi: string | null;
  kode_program_studi: number;
  created_at: Date;
  updated_at: Date;
}

export class CourseController {
  public async getCourses(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement Filter by Logged User
      // Temporary Use php_id = 6
      const userId = 'clo9h7ep30001verhydbjlc4v';

      const page = req.body.page || 1;

      const courses: ICourseData[] | ICourseFullData[] = await prisma.course.findMany({
        where: {
          user_id: userId,
        },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      });

      for (let i = 0; i < courses.length; i++) {
        const fetchedData = await fetch(`${process.env.PHP_APP}/api/courses/${courses[i].kode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const courseData = await fetchedData.json();

        if (courseData['status'] === 'success') {
          const temp: ICourseFullData = {
            ...courses[i],
            nama: courseData['data']['nama'],
            deskripsi: courseData['data']['deskripsi'],
            kode_program_studi: courseData['data']['kode_program_studi'],
          };

          courses[i] = temp;
        } else {
          res.status(500).json({
            status: 'error',
            message: 'Gagal mendapatkan data mata kuliah',
            data: null,
          });
          
          return;
        }
      }

      const totalCourses = await prisma.course.count();
      const totalPage = Math.ceil(totalCourses / 10); 

      res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan data mata kuliah',
        data: {
          courses: courses,
          total_page: totalPage,
        },
      });
    } catch (error) {
      console.log(error);
      
      res.status(500).json({
        status: 'error',
        message: 'Gagal mendapatkan data mata kuliah',
        data: null,
      });
    }

    return;
  }

  public async createCourse(req: Request, res: Response): Promise<void> {
    // TODO: Implement Filter by Logged User
    // Temporary Use php_id = 6
    const userId = 'clo9h7ep30001verhydbjlc4v';

    const kode: string = req.body.kode;
    const nama: string = req.body.nama;
    const deskripsi: string = req.body.deskripsi;
    const kode_program_studi: number = req.body.kode_program_studi;

    if (!kode || !nama || !kode_program_studi) {
      res.status(400).json({
        status: 'error',
        message: 'Data mata kuliah tidak lengkap',
        data: null,
      });

      return;
    }
    
    let responseData;

    try {
      const fetchedData = await fetch(`${process.env.PHP_APP}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kode: kode,
          nama: nama,
          deskripsi: deskripsi || null,
          kode_program_studi: kode_program_studi,
        }),
      });

      responseData = await fetchedData.json();
      if (responseData['status'] !== 'success') {
        res.status(500).json({
          status: 'error',
          message: 'Gagal membuat mata kuliah baru',
          data: null,
        });

        return;
      }
    } catch (error) {
      console.log(error);

      res.status(500).json({
        status: 'error',
        message: 'Gagal membuat mata kuliah baru',
        data: null,
      });

      return;
    }

    try {
      const course = await prisma.course.create({
        data: {
          kode: kode,
          user_id: userId,
        },
      });

      res.status(201).json({
        status: 'success',
        message: 'Berhasil membuat mata kuliah baru',
        data: {
          ...responseData['data'],
          id: course.id,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        status: 'error',
        message: 'Gagal membuat mata kuliah baru',
        data: null,
      });
    }

    return;
  }
}