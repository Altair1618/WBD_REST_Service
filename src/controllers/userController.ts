import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import { compare, hash } from '../utils/hasher';
import { PHP_URL, JWT_KEY } from '../config';
import prisma from "../utils/db";

export class UserController {
    public async login(req: Request, res: Response) {
        const { credential, password } = req.body;

        let user = null;
        try {
            user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: credential },
                        { email: credential },
                    ],
                },
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Kredensial atau password salah',
                data: null,
            });
        }

        if (user.status  === 'PENDING') {
            return res.status(403).json({
                status: 'error',
                message: 'Akun belum aktif',
                data: null,
            });
        }

        const isValid = await bcryptjs.compare(password, user.hashed_password);

        if (!isValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Kredensial atau password salah',
                data: null,
            });
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            tipe: user.tipe,
            php_id: user.php_id,
        }, JWT_KEY, {
            expiresIn: '1h',
        });

        return res.json({
            status: 'success',
            message: 'Login berhasil',
            data: {
                token,
            },
        });
    };

    public async register(req: Request, res: Response) {
        const { credential, password } = req.body;

        if (!credential || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Data tidak lengkap',
                data: null,
            });
        }

        let user = null;
        try {
            user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username: credential },
                        { email: credential },
                    ],
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }

        if (user) {
            return res.status(400).json({
                status: 'error',
                message: 'Username atau email sudah terdaftar',
                data: null,
            });
        }

        const responseData = await fetch(`${PHP_URL}/api/user?credentials=${credential}`);
        const userData = await responseData.json();

        if (userData['status'] !== 'success') {
            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }

        if (parseInt(userData['data']['tipe']) !== 0 && parseInt(userData['data']['tipe']) !== 1) {
            return res.status(400).json({
                status: 'error',
                message: 'Tipe user tidak valid',
                data: null,
            });
        }

        const hashedPassword = await hash(password);

        let newUser = null;
        try {
            newUser = await prisma.user.create({
                data: {
                    username: userData['data']['username'],
                    email: userData['data']['email'],
                    hashed_password: hashedPassword,
                    tipe: parseInt(userData['data']['tipe']),
                    php_id: parseInt(userData['data']['id']),
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }

        const token = jwt.sign({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            tipe: newUser.tipe,
            php_id: newUser.php_id,
        }, JWT_KEY, {
            expiresIn: '1h',
        });

        return res.status(201).json({
            status: 'success',
            message: 'Register berhasil',
            data: {
                token: token,
            },
        });
    }

    public async getUser(req: Request, res: Response) {
        const { id } = req.params;

        let user = null;
        try {
            user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    tipe: true,
                    php_id: true,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan',
                data: null,
            });
        }

        return res.json({
            status: 'success',
            message: 'User berhasil ditemukan',
            data: {
                user,
            },
        });
    }

    public async acceptUser(req: Request, res: Response) {
        const { id } = req.params;

        let user = null;
        try {
            user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    tipe: true,
                    php_id: true,
                    status: true,
                },
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan',
                data: null,
            });
        }

        if (user.status === 'ACCEPTED') {
            return res.status(400).json({
                status: 'error',
                message: 'User sudah dalam status ACCEPTED',
                data: null,
            });
        }

        let updatedUser = null;
        try {
            updatedUser = await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    status: 'ACCEPTED',
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    tipe: true,
                    php_id: true,
                    status: true,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }

        return res.json({
            status: 'success',
            message: 'User berhasil diterima',
            data: {
                user: updatedUser,
            },
        });
    }

    public async rejectUser(req: Request, res: Response) {
        const { id } = req.params;

        let user = null;
        try {
            user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    tipe: true,
                    php_id: true,
                    status: true,
                },
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan',
                data: null,
            });
        }

        if (user.status !== 'PENDING') {
            return res.status(400).json({
                status: 'error',
                message: 'User tidak dalam status PENDING',
                data: null,
            });
        }

        let deletedUser = null;
        try {
            deletedUser = await prisma.user.delete({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    tipe: true,
                    php_id: true,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }

        return res.json({
            status: 'success',
            message: 'User berhasil ditolak',
            data: {
                user: deletedUser,
            },
        });
    }
}
