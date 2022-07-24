import express, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"
import categoriesRoutes from "./routes/categoriesRoutes.js"
import gamesRoutes from "./routes/gamesRoutes.js"
import customersRoutes from "./routes/customersRoutes.js"
import rentalsRoutes from "./routes/rentalsRoutes.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(json())

app.use(categoriesRoutes)
app.use(gamesRoutes)
app.use(customersRoutes)
app.use(rentalsRoutes)

const PORT = process.env.PORT || 4001
app.listen(PORT, () => console.log('Servidor conectado'))

