import Usuario from '../users/user.model.js';

export const existenteEmail = async (correo = '') => {
    
    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la base de datos.`);
    }
}

export const existeUsuarioById = async (id = '') => {

    const existeUsuario = await Usuario.findById(id);
 
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe.`);
    }
}