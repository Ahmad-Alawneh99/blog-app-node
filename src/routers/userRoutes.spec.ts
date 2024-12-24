import rewire from 'rewire';
import sinon from 'sinon';
import { expect } from 'chai';
import { HttpStatus } from '../shared/httpStatusCodes';

const userRoutes = rewire('./userRoutes.ts');

describe('userRoutes', () => {
	describe('handleUserSignup', () => {
		const handleUserSignup = userRoutes.__get__('handleUserSignup');
		const mockRegisterUser = sinon.stub();
		const mockIsValidEmail = sinon.stub();
		const mockIsStrongPassword = sinon.stub();
		let mockReq: any;
		let mockRes: any;

		beforeEach(() => {
			userRoutes.__set__({
				validationUtils: {
					isValidEmail: mockIsValidEmail,
					isStrongPassword: mockIsStrongPassword,
				},
				tokenUtils: {
					signToken: sinon.stub().returns('mockSignedToken'),
				},
				userService: {
					registerUser: mockRegisterUser,
				},
			});

			mockReq = {
				body: {},
			};

			mockRes = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub(),
			};
			mockRegisterUser.reset();
		});

		it('should sign up successfully for a valid request', async () => {
			mockIsValidEmail.returns(true);
			mockIsStrongPassword.returns(true);
			mockReq.body = {
				name: 'mockName',
				password: 'mockPassword',
				email: 'mockEmail',
			};

			mockRegisterUser.resolves({
				success: true,
				userId: 'mockUserId',
			});

			await handleUserSignup(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.CREATED);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: true,
				status: HttpStatus.CREATED,
				token: 'mockSignedToken',
				userId: 'mockUserId',
			});
			expect(mockRegisterUser).to.have.been.calledWithExactly({
				name: 'mockName',
				password: 'mockPassword',
				email: 'mockEmail',
			});
		});

		it('should return an error if something goes wrong in the service', async () => {
			mockIsValidEmail.returns(true);
			mockIsStrongPassword.returns(true);
			mockReq.body = {
				name: 'mockName',
				password: 'mockPassword',
				email: 'mockEmail',
			};

			mockRegisterUser.resolves({
				success: false,
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Mock save error',
			});

			await handleUserSignup(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Mock save error',
			});
			expect(mockRegisterUser).to.have.been.calledWithExactly({
				name: 'mockName',
				password: 'mockPassword',
				email: 'mockEmail',
			});
		});

		it('should return an error if the email is invalid', async () => {
			mockIsValidEmail.returns(false);
			mockIsStrongPassword.returns(true);
			mockReq.body = {
				name: 'mockName',
				password: 'mockPassword',
				email: 'mockEmail',
			};

			await handleUserSignup(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.BAD_REQUEST);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Email is missing or invalid.',
			});
			expect(mockRegisterUser).not.to.have.been.called;
		});

		it('should return an error if the password is weak', async () => {
			mockIsValidEmail.returns(true);
			mockIsStrongPassword.returns(false);
			mockReq.body = {
				name: 'mockName',
				password: 'mockPassword',
				email: 'mockEmail',
			};

			await handleUserSignup(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.BAD_REQUEST);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Weak password. Ensure password contains a capital letter, a number and a symbol. Minimum length is 8 characters.',
			});
			expect(mockRegisterUser).not.to.have.been.called;
		});

		it('should return an error if the name is missing', async () => {
			mockIsValidEmail.returns(true);
			mockIsStrongPassword.returns(true);
			mockReq.body = {
				password: 'mockPassword',
				email: 'mockEmail',
			};

			await handleUserSignup(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.BAD_REQUEST);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Name is required.',
			});
			expect(mockRegisterUser).not.to.have.been.called;
		});

		it('should catch any thrown errors within the controller', async () => {
			mockIsValidEmail.returns(true);
			mockIsStrongPassword.returns(true);
			mockReq.body = {
				name: 'mockName',
				password: 'mockPassword',
				email: 'mockEmail',
			};

			mockRegisterUser.rejects(new Error('Mock error'));

			await handleUserSignup(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Mock error',
			});
			expect(mockRegisterUser).to.have.been.calledWithExactly({
				name: 'mockName',
				password: 'mockPassword',
				email: 'mockEmail',
			});
		});
	});

	describe('handleUserSignIn', () => {
		const handleUserSignIn = userRoutes.__get__('handleUserSignIn');
		const mockSignIn = sinon.stub();
		let mockReq: any;
		let mockRes: any;

		beforeEach(() => {
			userRoutes.__set__({
				tokenUtils: {
					signToken: sinon.stub().returns('mockSignedToken'),
				},
				userService: {
					signIn: mockSignIn,
				},
			});

			mockReq = {
				body: {},
			};

			mockRes = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub(),
			};
			mockSignIn.reset();
		});

		it('should sign in correctly for a valid request', async () => {
			mockReq.body = {
				email: 'mockEmail',
				password: 'mockPassword',
			};

			mockSignIn.resolves({
				success: true,
				userId: 'mockUserId',
				status: HttpStatus.OK,
			});

			await handleUserSignIn(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.OK);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: true,
				status: HttpStatus.OK,
				token: 'mockSignedToken',
			});
			expect(mockSignIn).to.have.been.calledWithExactly('mockEmail', 'mockPassword');
		});

		it('should return an error if email or password are missing', async () => {
			await handleUserSignIn(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.BAD_REQUEST);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Email and password are required.',
			});
			expect(mockSignIn).not.to.have.been.called;
		});

		it('should return an error if something goes wrong in the service', async () => {
			mockReq.body = {
				email: 'mockEmail',
				password: 'mockPassword',
			};

			mockSignIn.resolves({
				success: false,
				message: 'mock service error',
				status: HttpStatus.INTERNAL_SERVER_ERROR,
			});

			await handleUserSignIn(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				message: 'mock service error',
				status: HttpStatus.INTERNAL_SERVER_ERROR,
			});
			expect(mockSignIn).to.have.been.calledWithExactly('mockEmail', 'mockPassword');
		});

		it('should catch any thrown errors within the controller', async () => {
			mockReq.body = {
				email: 'mockEmail',
				password: 'mockPassword',
			};

			mockSignIn.rejects(new Error('mock error'));

			await handleUserSignIn(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				message: 'mock error',
				status: HttpStatus.INTERNAL_SERVER_ERROR,
			});
			expect(mockSignIn).to.have.been.calledWithExactly('mockEmail', 'mockPassword');
		});
	});

	describe('getUserData', () => {
		const getUserData = userRoutes.__get__('getUserData');
		const mockGetUserData = sinon.stub();
		let mockReq: any;
		let mockRes: any;

		beforeEach(() => {
			userRoutes.__set__({
				userService: {
					getUserData: mockGetUserData,
				},
			});

			mockReq = {
				userId: 'mockUserId',
			};

			mockRes = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub(),
			};
			mockGetUserData.reset();
		});

		it('should return data correctly for a valid request', async () => {
			mockGetUserData.resolves({
				success: true,
				status: HttpStatus.OK,
				user: 'mockUserData',
			});

			await getUserData(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.OK);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: true,
				status: HttpStatus.OK,
				user: 'mockUserData',
			});
			expect(mockGetUserData).to.have.been.calledWithExactly('mockUserId');
		});

		it('should catch any thrown errors within the controller', async () => {
			mockGetUserData.rejects(new Error('mock error'));

			await getUserData(mockReq, mockRes);

			expect(mockRes.status).to.have.been.calledWithExactly(HttpStatus.INTERNAL_SERVER_ERROR);
			expect(mockRes.json).to.have.been.calledWithExactly({
				success: false,
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'mock error',
			});
			expect(mockGetUserData).to.have.been.calledWithExactly('mockUserId');
		});
	});
});
