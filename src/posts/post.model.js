import { Schema, model } from 'mongoose';

const PostSchema = Schema({
    title: {
        type: String,
        required: [true, 'Title is required.'],
        maxLengt: [25, 'Cant be overcome 25 characters.']
    },
    content: {
        type: String,
        required: [true, 'Content is required.'],
        maxLengt: [500, 'Cant be overcome 500 characters.']
    },
    category: {
        type: String,
        required: [true, 'Category is required.']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
);

export default model('Post', PostSchema);
