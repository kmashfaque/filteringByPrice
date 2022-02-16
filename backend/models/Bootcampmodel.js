import mongoose from "mongoose";

const bootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name to the bootcamp"],
    unique: true,
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating for the rating"],
  },
  description: {
    type: String,
    required: [true, "Please provide bootcamp with description."],
  },
  price: {
    type: Number,
    required: [true, "Please provide bootcamp with price"],
  },
});

const Bootcamp = mongoose.model("Bootcamp", bootcampSchema);

export default Bootcamp;
