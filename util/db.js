import mongoose from "mongoose";

export const connect = (url = process.env.MONGO_CONNECTION_STRING) => {
  return mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
};
