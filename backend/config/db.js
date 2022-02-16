import mongoose from "mongoose"



const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION
            ,{
            
            useUnifiedTopology:true,
            useNewUrlParser:true
        })

        console.log("MongoDB connection SUCCESS 🌟");
    } catch (error) {
        console.log("MongoDB connection FAIL 🎇");
        console.error(error)
        process.exit(1)
    }
}
export default connectDB