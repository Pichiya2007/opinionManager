import Category from './category.model.js';
import Post from '../posts/post.model.js';

export const addCategory = async (req, res) => {
    try {

        const data = req.body;

        const category = new Category({
            name: data.name,
            status: data.status
        })

        await category.save();

        res.status(200).json({
            success: false,
            msg: 'Categoría agregada con exito.',
            category
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo agregar la categoría.',
            error: error.message
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const category = await Category.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Categoría actualizada con exito.'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'La categoría no se pudo editar.',
            error: error.message
        })
    }
}

export const getCategories = async (req, res) => {
    try {
        
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            categories
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las categorías.',
            error: error.message
        })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        
        const { id } = req.params;

        const defaultCategory = await Category.findOne({ name: 'General' }); // Encuentra la categoría por defecto

        if (!defaultCategory) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontró la categoría por defecto.'
            })
        }

        await Post.updateMany({ category: id }, { category: defaultCategory._id }); // Actualiza los posts con la categoría eliminada por la de defecto

        const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Categoría eliminada con exito.',
            category
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar la categoría.',
            error: error.message
        })
    }
}

export const defaultCategory = async () => {
    try {
        
        const defaultCategory = {
            name: 'General',
            status: true
        }   

        const categoryExists = await Category.findOne({ name: defaultCategory.name });

        if (categoryExists) {
            return console.log('La categoría por defecto ya existe.');
        }

        const category = new Category(defaultCategory);
        await category.save();

        console.log('Categoría por defecto creada con éxito.');

    } catch (error) {
        console.log('Error al crear la categoría por defecto.', error.message);
    }
}