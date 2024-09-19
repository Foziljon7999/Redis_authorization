import express, { Application } from "express";
import dotenv from "dotenv"
import router from "./routes";
dotenv.config()
import { ErrorHandlerMiddleware } from "@middlewares"

const app: Application = express()
app.use(express.json())
app.use(router)

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware)

const PORT = process.env.APP_PORT || 8000
app.listen(PORT, () => {console.log(PORT)})