// Dependencies
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Our schema definition
const gameSchema = new Schema(
    {
        name: String,
        year: Number,
        description: String,
        picture: String,
        postDate : { type: Date, default: Date.now } // Timestamp

    }
);

// We export the schema to use it anywhere else
export default mongoose.model('Game', gameSchema);