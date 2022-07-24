import { Router } from "express"
import { getCustomers, getCustomerByCpf ,postCustomers } from "../controllers/customersController.js"

const router = Router()

router.get("/customers", getCustomers)
router.get("/customers/:cpf", getCustomerByCpf)
router.post("/customers", postCustomers)

export default router