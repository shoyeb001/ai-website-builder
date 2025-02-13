import express, { Express } from 'express';
import chatRoute from "./routes/chat.route";
import cors from "cors";
import { rateLimit } from 'express-rate-limit'

const app: Express = express();
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

app.use(cors(
    {
        origin: ["http://localhost:5173"],
        credentials: true,
    }
));
app.use(express.json());
app.use(chatRoute)
app.use(limiter)


app.listen(8000, () => {
    console.log("App is listening on port 8000");
})
