import { Router } from 'express';
import { check } from 'express-validator';
import { addPost, getPosts, searchPost, deletePost, updatePost } from './post.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        check('title', 'El título es obligatorio.').not().isEmpty(),
        check('content', 'El contenido es obligatorio.').not().isEmpty(),
        check('category', 'La categoría es obligatoria.').not().isEmpty(),
        validarCampos
    ],
    addPost
)

router.get('/', getPosts);

router.get(
    '/:id',
    [
        check('id', 'No es un id válido.').isMongoId(),
        validarCampos
    ],
    searchPost
)

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un id válido.').isMongoId(),
        validarCampos
    ],
    deletePost
)

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un id válido.').isMongoId(),
        validarCampos
    ],
    updatePost
)

export default router;