import User from '../users/user.model.js';
import Category from '../category/category.model.js'
import Post from './post.model.js';
import Comment from '../comments/comment.model.js'

export const addPost = async (req, res) => {
    try {
        
        const data = req.body;
        const user = await User.findById(req.usuario._id);
        const category = await Category.findById(data.category);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado.'
            })
        }

        const post = new Post({
            title: data.title,
            content: data.content,
            category: category._id,
            author: user._id,
            status: true
        });

        await post.save();

        res.status(200).json({
            success: true,
            msg: 'Post creado exitosamente.',
            post
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al crear post',
            error: error.message
        })
    }
}

export const getPosts = async (req, res) => {

    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {
        
        const posts = await Post.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const postsWithUsers = await Promise.all(posts.map(async (post) => {
            const user = await User.findById(post.author);
            const postCategory = await Category.findById(post.category);
            return {
                ...post.toObject(),
                author: user ? user.name : 'Usuario no encontrado.', //Si el usuario no existe, se muestra el mensaje de usuario no encontrado, sino se muestra el nombre del usuario que creó el post
                category: postCategory ? postCategory.name : 'Categoría no encontrada.' //Si la categoría no existe, se muestra el mensaje de categoría no encontrada, sino se muestra el nombre de la categoría del post
            }
        }));

        const total = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            posts: postsWithUsers
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener posts',
            error: error.message
        })
    }
}

export const searchPost = async (req, res) => {

    const { id } = req.params;

    try {
        
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                msg: 'Post no encontrado.'
            })
        }

        const author = await User.findById(post.author);
        const category = await Category.findById(post.category);

        res.status(200).json({
            success: true,
            post: {
                ...post.toObject(),
                author: author ? author.name : 'Usuario no encontrado.',
                category: category ? category.name : 'Categoría no encontrada.'
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al buscar post',
            error: error.message
        })
    }
}

export const deletePost = async (req, res) => {

    const { id } = req.params;

    try {
        
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                msg: 'Post no encontrado.'
            })
        }

        if (post.author.toString() !== req.usuario._id.toString()) {
            return res.status(401).json({
                success: false,
                msg: 'No tienes permisos para eliminar este post.'
            })
        }

        await Comment.updateMany({ post: id }, { status: false });

        post.status = false;
        await post.save();

        res.status(200).json({
            success: true,
            msg: 'Post eliminado exitosamente.',
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar el post',
            error: error.message
        })
    }
}

export const updatePost = async (req, res) => {
    
    const { id } = req.params;
    const { _id, author, ...data } = req.body;

    try {
        
        if(!req.usuario) {
            return res.status(401).json({
                success: false,
                msg: 'Usuario no encontrado.'
            })
        }

        const post = await Post.findById(id).populate('author');

        if (!post) {
            return res.status(404).json({
                success: false,
                msg: 'Post no encontrado.'
            })
        }   

        if (post.author._id.toString() !== req.usuario._id.toString()) {
            return res.status(401).json({
                success: false,
                msg: 'No tienes permisos para actualizar este post.'
            })
        }

        if (author) {
            return res.status(401).json({
                success: false,
                msg: 'No se puede editar el autor del post.'
            })
        }

        Object.assign(post, data);
        await post.save();

        res.status(200).json({
            success: true,
            msg: 'Post actualizado exitosamente.',
            post
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el post',
            error: error.message
        })
    }
}