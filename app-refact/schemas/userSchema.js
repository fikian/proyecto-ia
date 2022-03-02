import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    idUser: String,
    token: String,
    username: String,
    lastname: String,
    cell: String,
    email: String,
    password: String,
    address: String,
    colonia: String,
    numhouse: String,
    postalcode: String,
    city: String,
    state: String,
    plan: Boolean,
    route: [
      {
        idDelivery: String,
        idUser: String,
        destination_addresses: String,
        username: String,
        lastname: String,
        state: String,
        distance: String,
        order: String,
        duration: String,
      },
    ],
    received: [
      {
        idDelivery: String,
        state: String,
        date: String,
      },
    ],
    otw: [
      {
        idDelivery: String,
        state: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model("user", userSchema);
