import { Router } from 'express';
import { check } from 'express-validator';
import { addComment, getComments, deleteComment, updateComment } from './comment.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        check('content', 'El contenido es obligatorio.').not().isEmpty(),
        check('post', 'El post es obligatorio.').not().isEmpty(),
        validarCampos
    ],
    addComment
)

router.get('/', getComments);

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'El id es obligatorio.').not().isEmpty(),
        validarCampos
    ],
    deleteComment
)

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'El id es obligatorio.').not().isEmpty(),
        validarCampos
    ],
    updateComment
)

export default router;