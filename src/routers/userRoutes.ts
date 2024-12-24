import express, { Request, Response } from 'express';
import * as tokenUtils from '../shared/tokenUtils';
import * as validationUtils from '../shared/validationUtils';
import { isUserLoggedIn } from '../shared/authUtils';
import { HttpStatus } from '../shared/httpStatusCodes';
import * as userService from '../services/userService';
import { ExtendedRequest } from '../shared/types';

const userRouter = express.Router();

const handleUserSignup = async (req: Request, res: Response) => {
	try {
		const { email, password, name } = req.body;

		const validationErrorResponse = { success: false, status: HttpStatus.BAD_REQUEST, message: '' };

		if (!validationUtils.isValidEmail(email)) {
			validationErrorResponse.message = 'Email is missing or invalid.';
		}

		if (!validationUtils.isStrongPassword(password)) {
			validationErrorResponse.message = 'Weak password. Ensure password contains a capital letter, a number and a symbol. Minimum length is 8 characters.';
		}

		if (!name) {
			validationErrorResponse.message = 'Name is required.';
		}

		if (validationErrorResponse.message) {
			return res.status(HttpStatus.BAD_REQUEST).json(validationErrorResponse);
		}

		const registerUserResponse = await userService.registerUser({ email, name, password });

		if (registerUserResponse.success) {
			const token = tokenUtils.signToken({ email, id: registerUserResponse.userId });

			return res.status(HttpStatus.CREATED).json({
				success: true,
				status: HttpStatus.CREATED,
				token,
				userId: registerUserResponse.userId,
			});
		} else {
			return res.status(registerUserResponse.status).json(registerUserResponse);
		}
	} catch (error) {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: error.message,
		});
	}
};

const handleUserSignIn = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Email and password are required.',
			});
		}

		const signInResponse = await userService.signIn(email, password);

		if (signInResponse.success) {
			const token = tokenUtils.signToken({ id: signInResponse.userId, email });

			return res.status(HttpStatus.OK).json({ success: true, status: HttpStatus.OK, token });
		} else {
			return res.status(signInResponse.status).json(signInResponse);
		}
	} catch (error) {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: error.message,
		});
	}
};

const getUserData = async (req: ExtendedRequest, res: Response) => {
	try {
		const { userId } = req;

		const getUserResponse = await userService.getUserData(userId);

		return res.status(getUserResponse.status).json(getUserResponse);
	} catch (error) {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: error.message,
		});
	}
};

userRouter.post('/sign-in', handleUserSignIn);
userRouter.post('/sign-up', handleUserSignup);
userRouter.get('/', isUserLoggedIn, getUserData);

export default userRouter;
