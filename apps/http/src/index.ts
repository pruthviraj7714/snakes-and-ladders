import express, { Request, Response } from "express"
import cors from "cors";
import { config } from "dotenv";
import { gameRouter } from "./routes/gameRoutes";
config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req : Request, res : Response) : void => {
    res.status(200).json({
        message : "Healthy Server"
    })
    return;
})

app.use('/game', gameRouter);


app.listen(3000, () => console.log("Server is running on Port 3000"));