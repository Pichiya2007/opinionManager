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