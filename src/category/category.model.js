import { Schema, model } from 'mongoose';

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'Name in required.'],
        maxLength: [25, 'Cant be overcome 25 characters.']
    },
    status: {
        type: Boolean,
        default: true
    } 
},
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Category', CategorySchema)