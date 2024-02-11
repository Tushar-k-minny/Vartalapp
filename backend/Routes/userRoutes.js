import { Router } from "express";
import { MessageHistory } from "../Controller/MessageHistory.js";

const router = Router()

router.get('/messages/:id', MessageHistory)

export default router