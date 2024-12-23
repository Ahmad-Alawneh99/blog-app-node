import { Request } from 'express';

export interface ExtendedRequest extends Request {
	userId: string;
}

export interface BlogDTO {
	_id?: string;
	title: string;
	content: string;
	owner: string;
	createdAt: number,
	updatedAt: number,
}

export interface BlogWithId extends BlogDTO {
	id: string;
}

export interface UserDTO {
	name: string;
	email: string;
	password: string;
}
