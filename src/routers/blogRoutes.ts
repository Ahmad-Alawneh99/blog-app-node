import express, { Response } from 'express';
import { isUserLoggedIn } from '../shared/authUtils';
import { HttpStatus } from '../shared/httpStatusCodes';
import * as blogService from '../services/blogService';
import { ExtendedRequest } from '../shared/types';

const blogRouter = express.Router();

const createBlog = async (req: ExtendedRequest, res: Response) => {
	try {
		const { title = '', content = '' } = req.body;

		if (!title || !content) {
			return res.status(400).json({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Blog title and content are required.',
			});
		}

		const createBlogResponse = await blogService.createBlog({ title, content }, req.userId);

		return res.status(createBlogResponse.status).json(createBlogResponse);
	} catch (error) {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: error.message,
		});
	}
};

const updateBlog = async (req: ExtendedRequest, res: Response) => {
	try {
		const { title = '', content = '' } = req.body;
		const { blogId } = req.params;

		if (!blogId) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Blog id is required.',
			});
		}

		if (!title && !content) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Provide title or content to update.',
			});
		}

		const updateBlogResponse = await blogService.updateBlog(
			{ title, content },
			blogId,
			req.userId,
		);

		return res.status(updateBlogResponse.status).json(updateBlogResponse);
	} catch (error) {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: error.message,
		});
	}
};

const deleteBlog = async (req: ExtendedRequest, res: Response) => {
	try {
		const { blogId } = req.params;

		if (!blogId) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Blog id is required.',
			});
		}

		const deleteBlogResponse = await blogService.deleteBlog(blogId, req.userId);

		return res.status(deleteBlogResponse.status).json(deleteBlogResponse);
	} catch (error) {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: error.message,
		});
	}
};

const getAllBlogs = async (req: ExtendedRequest, res: Response) => {
	try {
		const getAllBlogsResponse = await blogService.getAllBlogs(req.userId);

		return res.status(getAllBlogsResponse.status).json(getAllBlogsResponse);
	} catch (error) {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: error.message,
		});
	}
};

const getBlogById = async (req: ExtendedRequest, res: Response) => {
	try {
		const { blogId } = req.params;

		if (!blogId) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				success: false,
				status: HttpStatus.BAD_REQUEST,
				message: 'Blog id is required.',
			});
		}

		const getBlogResponse = await blogService.getBlogById(blogId, req.userId);

		return res.status(getBlogResponse.status).json(getBlogResponse);
	} catch (error) {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			message: error.message,
		});
	}
};

blogRouter.post('/', isUserLoggedIn, createBlog);
blogRouter.put('/:blogId', isUserLoggedIn, updateBlog);
blogRouter.delete('/:blogId', isUserLoggedIn, deleteBlog);

// for all users to see blogs
blogRouter.get('/public', getAllBlogs);
blogRouter.get('/public/:blogId', getBlogById);

// for user-specific blogs
blogRouter.get('/', isUserLoggedIn, getAllBlogs);
blogRouter.get('/:blogId', isUserLoggedIn, getBlogById);

export default blogRouter;
