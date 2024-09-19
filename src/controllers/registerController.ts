import { Request, Response } from "express";
import nodemailer from 'nodemailer'
import { PrismaClient } from "@prisma/client";
import { createClient } from 'redis';



const client = new  PrismaClient()

export const register = async (req: Request, res: Response) => {
let { fullName, email, password } = req.body

try {
    const existingUser = await client.user.findUnique({where: {email}})
    if(existingUser) {
        res.status(400).send({
            success: false,
            message: "User already exists"
        })}

    let redisClient = createClient()
    await redisClient.connect()
    // console.log("Connected to Redis")

    const code = Math.floor(Math.random() * 1000000).toString()
    await redisClient.setEx(email, 60, code);

    const newUser = await client.user.create({data: {fullName, email, password, code}})
    // console.log("New user created:", newUser);
    
    
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "azizkobulovbackend@gmail.com",
        pass: "wavnvetevsxjyzjf"
      }
    })

    let info = await transporter.sendMail({
      from: "azizkobulovbackend@gmail.com",
      to: email,
      text: "This code",
      subject: "Your registration code",
      html: `<b>Your code: ${code}</b>`
    })
    res.status(200).send({
      success: true,
      message: "Registration code sent",
      data: newUser
    })
} catch (error) {
    // console.error("Error: ", error)
    res.status(500).send({
        success: false,
        message: "Internal server error",
    })
}
}