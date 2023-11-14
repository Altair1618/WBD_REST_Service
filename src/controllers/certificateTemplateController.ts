import { Request, Response } from "express";
import prisma from "../utils/db";

interface ICertificateTemplateData {
  id: number;
  user_id: string;
  filename: string;
  name_px: number;
  name_py: number;
  created_at: Date;
  updated_at: Date;
}

export class CertificateTemplateController {
  public async getCertificateTemplate(req: Request, res: Response): Promise<void> {
    try {
      const userId = 'clo9h7ep30001verhydbjlc4v';

      const certificate: ICertificateTemplateData | null = await prisma.certificateTemplate.findFirst({
        where: {
          user_id: userId,
        }
      });

      // apakah harus simpen file template di sini atau di SPA?
      res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan data template sertifikat',
        data: certificate === null ? {
          filename: 'default.png', // harus mastiin ada file default.png di SPA
          name_px: 250,            // ada juga opsi lain: bikin route buat ngeset
          name_py: 150,            // default template dari SPA, dilakuin oleh admin
        } : {
          filename: certificate.filename,
          name_px: certificate.name_px,
          name_py: certificate.name_py,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        status: 'error',
        message: 'Gagal mendapatkan data template sertifikat',
        data: null,
      });
    }
  }

  public async createtCertificateTemplate(req: Request, res: Response): Promise<void> {
    const userId = 'clo9h7ep30001verhydbjlc4v';

    const filename: string = req.body.filename;
    const name_px: number = req.body.name_px;
    const name_py: number = req.body.name_py;

    if (!filename || !name_px || !name_py) {
      res.status(400).json({
        status: 'error',
        message: 'Data template sertifikat tidak lengkap',
        data: null,
      });

      return;
    }

    try {
      const certificate = await prisma.certificateTemplate.create({
        data: {
          user_id: userId,
          filename,
          name_px,
          name_py,
        }
      });
      res.status(201).json({
        status: 'success',
        message: 'Berhasil membuat template sertifikat baru',
        data: {
          ...certificate,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        status: 'error',
        message: 'Gagal membuat template sertifikat baru',
        data: null,
      });
    }
  }

  public async updateCertificateTemplate(req: Request, res: Response): Promise<void> {
    const userId = 'clo9h7ecourseControllerp30001verhydbjlc4v';

    const filename: string = req.body.filename;
    const name_px: number = req.body.name_px;
    const name_py: number = req.body.name_py;

    if (!filename || !name_px || !name_py) {
      res.status(400).json({
        status: 'error',
        message: 'Data template sertifikat tidak lengkap',
        data: null,
      });

      return;
    }

    try {
      let certificate = await prisma.certificateTemplate.findFirst({
        where: {
          user_id: userId,
        }
      });

      if (!certificate) {
        res.status(404).json({
          status: 'error',
          message: 'Template sertifikat tidak ditemukan',
          data: null,
        });

        return;
      }

      certificate = await prisma.certificateTemplate.update({
        where: {
          id: certificate.id,
        },
        data: {
          filename,
          name_px,
          name_py,
        }
      });

      res.status(200).json({
        status: 'success',
        message: 'Berhasil mengubah data template sertifikat',
        data: {
          ...certificate,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        status: 'error',
        message: 'Gagal mengubah data template sertifikat',
        data: null,
      });
    }
  }
}
