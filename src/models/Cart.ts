import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem {
	product: Types.ObjectId;
	variant: string;
	quantity: number;
}

export interface ICart extends Document {
	token: string;
	items: ICartItem[];
	createdAt: Date;
	promoCode?: string;
}

const cartItemSchema = new Schema<ICartItem>({
	product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
	variant: { type: String, required: true },
	quantity: { type: Number, required: true }
});

const cartSchema = new Schema<ICart>({
	token: { type: String, required: true, unique: true },
	items: [cartItemSchema],
	createdAt: { type: Date, default: Date.now },
	promoCode: { type: String }
});

export default model<ICart>("Cart", cartSchema);
