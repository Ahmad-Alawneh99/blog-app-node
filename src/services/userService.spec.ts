import rewire from 'rewire';
import sinon from 'sinon';
import { expect } from 'chai';
import { HttpStatus } from '../shared/httpStatusCodes';

const userService = rewire('./userService');

describe('userService', () => {
	describe('createUser', () => {
		const registerUser = userService.__get__('registerUser');
		const mockUserModel = sinon.stub();

		beforeEach(() => {
			userService.__set__({
				user_1: {
					default: mockUserModel,
				},
				bcrypt: {
					hash: sinon.stub().resolves('mockHashedPassword'),
				},
			});
		});

		it('should register a user correctly', async () => {
			mockUserModel.returns({
				_id: 'mockCreatedId',
				save: sinon.stub().resolves(),
			});

			const result = await registerUser({
				email: 'mockEmail',
				password: 'mockPassword',
				name: 'mockName',
			});

			expect(result).to.deep.equal({
				success: true,
				status: HttpStatus.CREATED,
				userId: 'mockCreatedId',
			});
			expect(mockUserModel).to.have.been.calledWithExactly({
				email: 'mockEmail',
				name: 'mockName',
				password: 'mockHashedPassword',
			});
		});
	});
});
