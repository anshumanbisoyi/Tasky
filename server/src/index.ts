import express, {Express} from "express";
import mongoose from "mongoose";
import taskRoute from "./routes/taskRoute";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());
const mongoURI: string = "mongodb+srv://ansuman:18CsxREhG6cdQiEV@tasky.frlhiwo.mongodb.net/";

mongoose
.connect(mongoURI)
.then(()=> console.log("CONNECT TO MONGODB!"))
.catch((err)=>console.error("Failed to connect MDB",err))

app.use("/tasks", taskRoute);

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})