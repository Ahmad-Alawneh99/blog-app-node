import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToMongoDB } from './shared/dbConnect';
import userRouter from './routers/userRoutes';
import blogRouter from './routers/blogRoutes';

dotenv.config();
const app = express();
const port = 3030;
connectToMongoDB().catch((error) => console.log('failed to connect to mongodb', error));

app.use(express.json());
app.use(cors({
	origin: (origin, callback) => {
		if (process.env.ENV_TYPE === 'LOCAL') {
			return callback(null, true);
		}

		const backendURL = 'URL HERE';

		if (origin === backendURL) {
			return callback(null, true);
		} else {
			return callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
}));

app.get('/', (req: Request, res: Response) => {
	return res.send('Blog app backend');
});

app.use('/users', userRouter);
app.use('/blogs', blogRouter);

app.listen(port, () => {
	console.log(`Blog app listening on port ${port}`);
});
