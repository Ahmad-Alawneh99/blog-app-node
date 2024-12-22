import { expect } from 'chai';
import rewire from 'rewire';
import sinon from 'sinon';
import mongoose from 'mongoose';

const dbConnect = rewire('./dbConnect.ts');

describe('authUtils', () => {
	describe('connectToMongoDB', () => {
		const connectToMongoDB = dbConnect.__get__('connectToMongoDB');

		it('should connect to mongodb correctly', async () => {
			const mockMongooseConnect = sinon.stub().resolves();
			const mockConsoleLog = sinon.stub();
			mongoose.connect = mockMongooseConnect;

			dbConnect.__set__({
				console: {
					log: mockConsoleLog,
				},
			});

			process.env.DB_URL = 'mockMongodbURL';

			await connectToMongoDB();

			expect(mockMongooseConnect).to.have.been.calledWithExactly('mockMongodbURL');
			expect(mockConsoleLog).to.have.been.calledWithExactly('Connected to MongoDB');
		});

		it('should throw if connection to mongodb fails', async () => {
			const mockMongooseConnect = sinon.stub().rejects(new Error('mock mongodb connection error'));
			const mockConsoleError = sinon.stub();
			mongoose.connect = mockMongooseConnect;

			dbConnect.__set__({
				console: {
					error: mockConsoleError,
				},
			});

			process.env.DB_URL = '';

			await connectToMongoDB();

			expect(mockMongooseConnect).to.have.been.calledWith('');
			expect(mockConsoleError).to.have.been.calledWith('Error connecting to MongoDB');
		});
	});
});
