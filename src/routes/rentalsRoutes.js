import { Router } from "express"
import { getRentals, postRentals , returnRentals, deleteRentals} from "../controllers/rentalsController.js"

const router = Router()

router.get("/rentals", getRentals)
router.post("/rentals", postRentals)
router.post("/rentals/:id/return", returnRentals)
router.delete("/rentals/:id", deleteRentals)

export default router