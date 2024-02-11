import { Router } from 'express'
import { register } from '../Controller/register.js'
import { Profile } from '../Controller/profile.js'
import { Login } from '../Controller/login.js'

const router = Router()

router.post('/register', register)
router.get('/profile', Profile)
router.post('/login', Login)

export default router 