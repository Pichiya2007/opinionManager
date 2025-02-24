import User from '../users/user.model.js';
import Post from '../posts/post.model.js';
import Comment from './comment.model.js'

export const addComment = async (req, res) => {
    try {
        
        const data = req.body;
        const user = await User.findById(req.usuario._id);
        const post = await Post.findById(data.post);

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Usuario no encontrado.'
            })
        }

        if (!post) {
            return res.status(400).json({
                success: false,
                msg: 'Post no encontrado.'
            })
        }

        const comment = new Comment({
            content: data.content,
            author: user._id,
            post: post._id,
            status: true
        });

        await comment.save();

        res.status(200).json({
            success: true,
            msg: 'Comentario agregado correctamente.',
            comment
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al agregar comentario',
            error: error.message
        })
    }
}

export const getComments = async (req, res) => {

    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {
        
        const comments = await Comment.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const commentsWithUsers = await Promise.all(comments.map(async (comment) => {
            const user = await User.findById(comment.author);
            const post = await Post.findById(comment.post);
            return {
                ...comment.toObject(),
                author: user ? user.name : 'Usuario no encontrado.',
                postTitle: post ? post.title : 'Post no encontrado.',
                postContent: post ? post.content : 'Post no encontrado.'
            }
        }));

        const total = await Comment.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            comments: commentsWithUsers
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener comentarios',
            error: error.message
        })
    }
}

export const deleteComment = async (req, res) => {
    
    const { id } = req.params;

    try {
        
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado.'
            })
        }

        if (comment.author.toString() !== req.usuario._id.toString()) {
            return res.status(401).json({
                success: false,
                msg: 'No tienes permiso para eliminar este comentario.'
            })
        }

        comment.status = false;
        await comment.save();

        res.status(200).json({
            success: true,
            msg: 'Comentario eliminado correctamente.',
            comment
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar el comentario.',
            error: error.message
        })
    }
}

export const updateComment = async (req, res) => {

    const { id } = req.params;
    const { _id, author, post, ...data } = req.body;

    try {

        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                msg: 'Usuario no encontrado.'
            })
        }
        
        const comment = await Comment.findById(id).populate('author');

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado.'
            })
        }

        if (comment.author._id.toString() !== req.usuario._id.toString()) {
            return res.status(401).json({
                success: false,
                msg: 'No tienes permiso para actualizar este comentario.'
            })
        }

        if (author) {
            return res.status(401).json({
                success: false,
                msg: 'No puedes editar el autor del comentario.'
            })
        }

        if (post) {
            res.status(401).json({
                success: false,
                msg: 'No puedes editar el post del comentario.'
            })
        }

        Object.assign(comment, data);
        await comment.save();

        res.status(200).json({
            success: true,
            msg: 'Comentario actualizado exitosamente.',
            comment
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el comentario.',
            error: error.message
        })
    }
}