import * as bcrypt from 'bcrypt';
import User from '../models/user';
import { UserDTO } from '../shared/types';
import { HttpStatus } from '../shared/httpStatusCodes';

interface UserAuthenticationResponse {
	success: boolean,
	status: HttpStatus,
	message?: string,
	userId?: string;
}

export const registerUser = async (userData: UserDTO): Promise<UserAuthenticationResponse> => {
	try {
		const hashedPassword = await bcrypt.hash(userData.password, 16);
		const user = new User({ email: userData.email, password: hashedPassword, name: userData.name });
		await user.save();

		return {
			success: true,
			status: HttpStatus.CREATED,
			userId: user._id,
		};
	} catch (error) {
		if (error.code === 11000) { // MongoDB error for a duplicate field (in this case, email, since it is supposed to be unique)
			return {
				success: false,
				status: HttpStatus.CONFLICT,
				message: 'Email already exists.',
			};
		} else {
			return {
				success: false,
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: error.message,
			};
		}
	}
};

export const signIn = async (email: string, password: string): Promise<UserAuthenticationResponse> => {
	const user = await User.findOne({ email });
	const invalidDataResponse = {
		success: false,
		status: HttpStatus.BAD_REQUEST,
		message: 'Invalid email or password.',
	};

	if (!user) {
		return invalidDataResponse;
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return invalidDataResponse;
	}

	return { success: true, status: HttpStatus.OK, userId: user._id };
};

export const getUserData = async (userId: string) => {
	const user = await User.findOne({ _id: userId });
	if (!user) {
		return {
			status: HttpStatus.BAD_REQUEST,
			message: 'Profile info not found.',
			success: false,
		};
	}

	user.password = ''; // do not return password with the response

	return {
		user,
		success: true,
		status: HttpStatus.OK,
	};
};
