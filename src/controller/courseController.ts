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
  kode_prodi: number;
  created_at: Date;
  updated_at: Date;
}

export class CourseController {
  public async getCourses(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement Filter by Logged User
      const page = req.body.page || 1;

      const courses: ICourseData[] | ICourseFullData[] = await prisma.course.findMany({
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      });

      for (let i = 0; i < courses.length; i++) {
        const fetchedData = await fetch(`${process.env.PHP_APP}/api/courses/${courses[i].kode}`);
        const courseData = await fetchedData.json();

        if (courseData['status'] === 'success') {
          const temp: ICourseFullData = {
            ...courses[i],
            nama: courseData['data']['nama'],
            deskripsi: courseData['data']['deskripsi'],
            kode_prodi: courseData['data']['kode_program_studi'],
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
}