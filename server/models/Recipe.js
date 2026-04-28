const mongoose = require('mongoose');

// Sub-schema for a single ingredient inside a recipe
const IngredientSchema = new mongoose.Schema(
{
    name:     { type: String, required: true, trim: true },
    quantity: { type: Number, default: null },   // null = "to taste"
    unit:     { type: String, default: '',   trim: true },
},
{ _id: false }   // ingredients don't need their own _id, they live inside the recipe
);

const RecipeSchema = new mongoose.Schema(
{
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,   // Phase 3 flips this to true
        index: true,
    },
    name:
    {
        type: String,
        required: [true, 'Recipe name is required'],
        trim: true,
    },
    ingredients: [IngredientSchema],

    // Instructions stored as an array of strings, one string per step
    instructions: [{ type: String, trim: true }],

    // Optional fields, client can send these, we store them if present
    prep:     { type: String, default: '' },
    servings: { type: Number, default: null },
    // Tags user-assigned, mix of defaults and custom strings
    tags: 
    { 
        type: [String], 
        default: [] 
    },
},
{
    timestamps: true,
    toJSON:
    {
        virtuals: true,
        versionKey: false,
        transform: (_doc, ret) => { delete ret._id; },
    },
});

// "id" virtual: returns _id as a plain hex string
RecipeSchema.virtual('id').get(function () { return this._id.toHexString(); });

module.exports = mongoose.model('Recipe', RecipeSchema);