
import { Schema, model, Document } from "mongoose";

export interface IPromo extends Document {
	code: string;
	discountType: "percent" | "fixed";
	amount: number;
	validFrom?: Date;
	validTo?: Date;
}

const promoSchema = new Schema<IPromo>({
	code: { type: String, required: true, unique: true },
	discountType: { type: String, enum: ["percent", "fixed"], required: true },
	amount: { type: Number, required: true },
	validFrom: Date,
	validTo: Date
});

export default model<IPromo>("Promo", promoSchema);
