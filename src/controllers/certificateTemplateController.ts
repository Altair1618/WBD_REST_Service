import { Request, Response } from "express";
import prisma from "../utils/db";
import path from "path";
import fs from "fs";

interface ICertificateTemplateData {
  id: number;
  user_id: string;
  filename: string;
  name_px: number;
  name_py: number;
  created_at: Date;
  updated_at: Date;
}


function fileToBase64(filePath: string): Promise<string | null> {
  return new Promise<string | null>((resolve, reject) => {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      reject(new Error('File not found'));
      return;
    }

    // Read the file content
    fs.readFile(filePath, (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      // Convert the file content to base64
      const base64String = Buffer.from(data).toString('base64');
      const mimeType = path.extname(filePath).slice(1); // Get the file extension as MIME type
      const dataUrl = `data:${mimeType};base64,${base64String}`;

      resolve(dataUrl);
    });
  });
}

export class CertificateTemplateController {
  public async getCertificateTemplate(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = res.locals.user['id'];

      const certificate: ICertificateTemplateData | null = await prisma.certificateTemplate.findFirst({
        where: {
          user_id: userId,
        }
      });

      if (!certificate) {
        res.status(200).json({
          status: 'success',
          message: 'Berhasil mendapatkan data template sertifikat',
          data: {
            file: await fileToBase64("certificate_templates/default.png"),
            name_px: 250,
            name_py: 150,
            default: true,
          }
        });
      } else {
        res.status(200).json({
          status: 'success',
          message: 'Berhasil mendapatkan data template sertifikat',
          data: {
            file: await fileToBase64(`certificate_templates/${certificate.filename}`),
            name_px: certificate.name_px,
            name_py: certificate.name_py,
            default: false,
          }
        });
      }
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
    const userId: string = res.locals.user['id'];

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
    const userId: string = res.locals.user['id'];

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

  public async deleteCertificateTemplate(req: Request, res: Response): Promise<void> {
    const userId: string = res.locals.user['id'];

    try {
      let certificate = await prisma.certificateTemplate.findFirst({
        where: {
          user_id: userId
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

      certificate = await prisma.certificateTemplate.delete({
        where: {
          id: certificate.id
        },
      });

      res.status(200).json({
        status: 'success',
        message: 'Berhasil menghapus data template sertifikat',
        data: null,
      });

      return;
    } catch (error) {
      console.log(error);

      res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus data template sertifikat',
        data: null,
      });
    }

    return;
  }
}
