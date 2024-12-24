"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogById = exports.getAllBlogs = exports.deleteBlog = exports.updateBlog = exports.createBlog = void 0;
const luxon_1 = require("luxon");
const blog_1 = __importDefault(require("../models/blog"));
const httpStatusCodes_1 = require("../shared/httpStatusCodes");
const createBlog = (blogData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const now = luxon_1.DateTime.now().toMillis();
    const preparedBlogData = {
        title: blogData.title,
        content: blogData.content,
        owner: userId,
        createdAt: now,
        updatedAt: now,
    };
    const blog = new blog_1.default(preparedBlogData);
    yield blog.save();
    return {
        success: true,
        status: httpStatusCodes_1.HttpStatus.CREATED,
        message: 'Blog created successfully',
        blogId: blog.id,
    };
});
exports.createBlog = createBlog;
const updateBlog = (blogData, blogId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBlog = yield blog_1.default.findById(blogId);
    if (!existingBlog) {
        return {
            success: false,
            status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
            message: 'Blog not found.',
        };
    }
    if (existingBlog.owner !== userId) {
        return {
            success: false,
            status: httpStatusCodes_1.HttpStatus.FORBIDDEN,
            message: 'You do not have access to update this blog',
        };
    }
    const dataToUpdate = Object.assign(Object.assign(Object.assign({}, (blogData.title ? { title: blogData.title } : {})), (blogData.content ? { content: blogData.content } : {})), { updatedAt: luxon_1.DateTime.now().toMillis() });
    yield blog_1.default.findByIdAndUpdate(blogId, dataToUpdate);
    return {
        success: true,
        status: httpStatusCodes_1.HttpStatus.OK,
        message: 'Blog updated successfully',
    };
});
exports.updateBlog = updateBlog;
const deleteBlog = (blogId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_1.default.findById(blogId);
    if (!blog) {
        return {
            success: false,
            status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
            message: 'Blog not found.',
        };
    }
    if (blog.owner !== userId) {
        return {
            success: false,
            status: httpStatusCodes_1.HttpStatus.FORBIDDEN,
            message: 'You do not have access to delete this blog',
        };
    }
    yield blog_1.default.findByIdAndDelete(blogId);
    return {
        success: true,
        status: httpStatusCodes_1.HttpStatus.OK,
        message: 'Blog deleted successfully',
    };
});
exports.deleteBlog = deleteBlog;
const getAllBlogs = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = userId ? { owner: userId } : {};
    const blogs = yield blog_1.default.find(query)
        .sort([['updatedAt', -1]])
        .populate('owner', '-password-email');
    return {
        success: true,
        status: httpStatusCodes_1.HttpStatus.OK,
        blogs,
    };
});
exports.getAllBlogs = getAllBlogs;
const getBlogById = (blogId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_1.default.findOne({ _id: blogId }).populate('owner', '-password-email');
    if (!blog) {
        return {
            success: false,
            status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
            message: 'Blog not found',
        };
    }
    // workaround because typescript isn't recognizing that 'owner' is an object here
    if (userId && blog.owner._id !== userId) {
        return {
            success: false,
            status: httpStatusCodes_1.HttpStatus.FORBIDDEN,
            message: 'You do not have access to this blog',
        };
    }
    return {
        success: true,
        status: httpStatusCodes_1.HttpStatus.OK,
        blog,
    };
});
exports.getBlogById = getBlogById;
