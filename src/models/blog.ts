import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const blogSchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuidv4,
	},
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
	},
	updatedAt: {
		type: Date,
		required: true,
	},
	owner: {
		type: String,
		ref: 'User',
	},
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
