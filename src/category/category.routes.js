import { Router } from 'express';
import { check } from 'express-validator';
import { addCategory } from './category.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/role-validator.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        tieneRole('ADMIN_ROLE'),
        validarCampos
    ],
    addCategory
)

export default router;