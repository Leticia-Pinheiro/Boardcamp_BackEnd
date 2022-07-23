import { Router } from "express"
import { getCustomers, postCustomers } from "../controllers/customersController.js"

const router = Router()

router.get("/customers", getCustomers)
router.post("/customers", postCustomers)

export default router