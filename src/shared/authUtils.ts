import { NextFunction, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import * as tokenUtils from './tokenUtils';
import { ExtendedRequest } from './types';
import { HttpStatus } from './httpStatusCodes';

export const isUserLoggedIn = (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const cookies = req.headers.cookie || '';

	try {
		const blogAppToken = cookies.split(';').find((cookie) => cookie.trim().startsWith('blog_app_token'))?.split('=')[1] || '';
		const validatedToken = tokenUtils.verifyToken(blogAppToken) as JwtPayload;

		req.userId = validatedToken.id as string;

		return next();
	} catch (error) {
		return res.status(HttpStatus.UNAUTHORIZED).send({ success: false, code: HttpStatus.UNAUTHORIZED, message: 'Authentication required' });
	}
};
