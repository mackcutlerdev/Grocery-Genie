const mongoose = require('mongoose');

// Each pantry item belongs to a user (userId added in Phase 3,
// but we define the field now so we don't need a migration later)
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
    timestamps: true,
    // toJSON runs whenever res.json() serialises a document.
    // We expose _id as a plain string "id" field, matching the
    // shape the client already expects from the old uuid-based code.
    toJSON:
    {
        virtuals: true,
        versionKey: false,
        transform: (_doc, ret) => { delete ret._id; },
    },
});

// "id" virtual: returns _id as a plain hex string
ItemSchema.virtual('id').get(function () { return this._id.toHexString(); });

module.exports = mongoose.model('Item', ItemSchema);