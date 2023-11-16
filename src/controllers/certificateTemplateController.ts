import { Request, Response } from "express";
import prisma from "../utils/db";
import path from "path";
import fs from "fs";
import { createCanvas, loadImage } from "canvas";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

interface ICertificateTemplateData {
  id: number;
  user_id: string;
  filename: string;
  name_px: number;
  name_py: number;
  created_at: Date;
  updated_at: Date;
}

const DEFAULT_NAME_PX = 1000;
const DEFAULT_NAME_PY = 650;

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

      res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan data template sertifikat',
        data: {
          file: await fileToBase64(`certificate_templates/${certificate?.filename || 'default.png'}`),
          name_px: certificate?.name_px || DEFAULT_NAME_PX,
          name_py: certificate?.name_py || DEFAULT_NAME_PY,
          default: !certificate,
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
      console.error(error);

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
      console.error(error);

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
      console.error(error);

      res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus data template sertifikat',
        data: null,
      });
    }

    return;
  }

  public async sendCertificate(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user['id'];
    const name = req.body.name;
    const email = req.body.email;

    if (!name || !email) {
      res.status(400).json({
        status: 'error',
        message: 'Data pengiriman sertifikat tidak lengkap',
        data: null,
      });

      return;
    }

    try {
      const certificate = await prisma.certificateTemplate.findFirst({
        where: {
          user_id: userId,
        }
      });

      const filename = certificate?.filename || 'default.png';
      const name_px = certificate?.name_px || DEFAULT_NAME_PX;
      const name_py = certificate?.name_py || DEFAULT_NAME_PY;

      loadImage(`certificate_templates/${filename}`).then((img) => {
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, img.width, img.height);

        ctx.font = '62px Montserrat';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, name_px, name_py);

        const pdfDoc = new PDFDocument({ size: [canvas.width, canvas.height] });

        // Pipe the canvas PNG stream to the PDF document
        pdfDoc.image(canvas.toBuffer(), 0, 0, { width: canvas.width, height: canvas.height });

        const pdfBuffer: Buffer[] = [];
        pdfDoc.on('data', pdfBuffer.push.bind(pdfBuffer));
        pdfDoc.on('end', () => {
          const attachment = Buffer.concat(pdfBuffer);

          // Create a transport for nodemailer (use your email provider's SMTP settings)
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_EMAIL_PASSWORD,
            },
          });

          // Create an email with the PDF attachment
          const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Sertifikat Kursus Premium LearnIt",
            text: `Halo, ${name}.\n\nSelamat karena telah menyelesaikan kursus premium di LearnIt. Sebagai apresiasi, kami memberikan sertifikat penghargaan untuk Anda. Semoga bermanfaat.`,
            attachments: [
              {
                filename: `Sertifikat LearnIt ${name}.pdf`,
                content: attachment,
                encoding: "base64",
              },
            ],
          };

          // Send the email
          transporter.sendMail(mailOptions, (error, _info) => {
            if (error) {
              throw error;
            }
            res.status(200).json({
              status: 'success',
              message: 'Berhasil mengirimkan sertifikat',
              data: null
            })
          });
        });

        pdfDoc.end();

      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        status: 'error',
        message: 'Gagal mengirim sertifikat',
        data: null,
      });
    }
  }
}
