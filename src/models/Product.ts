
import { Schema, model, Document } from "mongoose";

export interface IVariant {
	name: string;
	price: number;
}

export interface IProduct extends Document {
	name: string;
	variants: IVariant[];
	createdAt: Date;
}

const productSchema = new Schema<IProduct>({
	name: { type: String, required: true },
	variants: [
		{
			name: { type: String, required: true },
			price: { type: Number, required: true }
		}
	],
	createdAt: { type: Date, default: Date.now }
});

export default model<IProduct>("Product", productSchema);
