import { Schema, model } from "mongoose";

const VariantSchema = new Schema({
	productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
	title: String,
	price: { type: Number, required: true },
	currency: { type: String, default: "BDT" },
	stock: { type: Number, default: 0 },
	attributes: { type: Map, of: String },
});

export default model("Variant", VariantSchema);
