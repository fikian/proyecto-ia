import mongoose from "mongoose";
const { Schema } = mongoose;

const listSchema = new Schema(
  {
    id: String,
    deliveries: [
      {
        idDelivery: String,
        state: String,
        date: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const ListDelyveries = mongoose.model("list", listSchema);
