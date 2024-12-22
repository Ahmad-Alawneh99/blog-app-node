import mongoose from 'mongoose';

export async function connectToMongoDB() {
	try {
		await mongoose.connect(process.env.DB_URL || '');
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
	}
}
