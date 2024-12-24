import { DateTime } from 'luxon';
import { BlogDTO } from '../shared/types';
import Blog from '../models/blog';
import { HttpStatus } from '../shared/httpStatusCodes';

export const createBlog = async (blogData: Pick<BlogDTO, 'title' | 'content'>, userId: string) => {
	const now = DateTime.now().toMillis();
	const preparedBlogData: BlogDTO = {
		title: blogData.title,
		content: blogData.content,
		owner: userId,
		createdAt: now,
		updatedAt: now,
	};

	const blog = new Blog(preparedBlogData);

	await blog.save();

	return {
		success: true,
		status: HttpStatus.CREATED,
		message: 'Blog created successfully',
		blogId: blog.id,
	};
};

export const updateBlog = async (
	blogData: Pick<BlogDTO, 'title' | 'content'>,
	blogId: string,
	userId: string
) => {
	const existingBlog = await Blog.findById(blogId);

	if (!existingBlog) {
		return {
			success: false,
			status: HttpStatus.BAD_REQUEST,
			message: 'Blog not found.',
		};
	}

	if (existingBlog.owner !== userId) {
		return {
			success: false,
			status: HttpStatus.FORBIDDEN,
			message: 'You do not have access to update this blog',
		};
	}

	const dataToUpdate = {
		...(blogData.title ? { title: blogData.title } : {}),
		...(blogData.content ? { content: blogData.content } : {}),
		updatedAt: DateTime.now().toMillis(),
	};

	await Blog.findByIdAndUpdate(blogId, dataToUpdate);

	return {
		success: true,
		status: HttpStatus.OK,
		message: 'Blog updated successfully',
	};
};

export const deleteBlog = async (blogId: string, userId: string) => {
	const blog = await Blog.findById(blogId);

	if (!blog) {
		return {
			success: false,
			status: HttpStatus.BAD_REQUEST,
			message: 'Blog not found.',
		};
	}

	if (blog.owner !== userId) {
		return {
			success: false,
			status: HttpStatus.FORBIDDEN,
			message: 'You do not have access to delete this blog',
		};
	}

	await Blog.findByIdAndDelete(blogId);

	return {
		success: true,
		status: HttpStatus.OK,
		message: 'Blog deleted successfully',
	};
};

export const getAllBlogs = async (userId?: string) => {
	const query = userId ? { owner: userId } : {};

	const blogs = await Blog.find(query)
		.sort([['updatedAt', -1]])
		.populate('owner', '-password-email');

	return {
		success: true,
		status: HttpStatus.OK,
		blogs,
	};
};

export const getBlogById = async (blogId: string, userId?: string) => {
	const blog = await Blog.findOne({ _id: blogId }).populate('owner', '-password-email');

	if (!blog) {
		return {
			success: false,
			status: HttpStatus.BAD_REQUEST,
			message: 'Blog not found',
		};
	}

	// workaround because typescript isn't recognizing that 'owner' is an object here
	if (userId && (blog.owner as unknown as { _id: string })._id !== userId) {
		return {
			success: false,
			status: HttpStatus.FORBIDDEN,
			message: 'You do not have access to this blog',
		};
	}

	return {
		success: true,
		status: HttpStatus.OK,
		blog,
	};
};
