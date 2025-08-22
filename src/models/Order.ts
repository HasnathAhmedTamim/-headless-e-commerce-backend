import { Schema, model, Document, Types } from "mongoose";

export interface IOrder extends Document {
	cart: Types.ObjectId;
	items: any[];
	status: string;
	total: number;
	createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
	cart: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
	items: [{
		product: { type: Schema.Types.ObjectId, ref: "Product" },
		variant: String,
		quantity: Number
	}],
	status: { type: String, required: true },
	total: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now }
});

export default model<IOrder>("Order", orderSchema);
