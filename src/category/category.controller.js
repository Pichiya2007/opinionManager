import Category from './category.model.js'

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