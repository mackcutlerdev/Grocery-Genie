const mongoose = require('mongoose');

// Each pantry item belongs to a user (userId added in Phase 3,
// but we define the field now so we don't need a migration later, cause that'd be tedious)
const ItemSchema = new mongoose.Schema(
{
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,   // not required until auth is live (Phase 3 flips this to true)
        index: true,       // indexed so filtering by user is fast
    },
    name:
    {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
    },
    quantity:
    {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    unit:
    {
        type: String,
        default: 'Unit',
        trim: true,
    },
},
{
    // Adds createdAt and updatedAt timestamps automatically
    timestamps: true,
});

module.exports = mongoose.model('Item', ItemSchema);