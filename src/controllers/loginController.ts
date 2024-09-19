import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const client = new PrismaClient()

export const login = async (req: Request, res: Response) => {
    const { email, code } = req.body
    try {
        const user = await client.user.findUnique({ where: { email } })
        if (!user) {
            res.status(400).send({
                success: false,
                message: "No such user exists"
            })
        }

        if (user?.code !== code) {
            res.status(400).send({
                success: false,
                message: "Invalid or expired code"
            })
        }

        const secretKey = process.env.SECRET_KEY
        if (!secretKey) {
            throw new Error("Jwt secretKey is not defined")
        }

        const token = jwt.sign({ id: user?.id }, secretKey, { expiresIn: "1h" })
        res.status(200).send({
            success: true,
            message: "Login successFul",
            token: token,
            user: {
                id: user?.id,
                fullName: user?.fullName,
                email: user?.email
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Internal server error"
        })
    }
}