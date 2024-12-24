"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const authUtils_1 = require("../shared/authUtils");
const httpStatusCodes_1 = require("../shared/httpStatusCodes");
const blogService = __importStar(require("../services/blogService"));
const blogRouter = express_1.default.Router();
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title = '', content = '' } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
                message: 'Blog title and content are required.',
            });
        }
        const createBlogResponse = yield blogService.createBlog({ title, content }, req.userId);
        return res.status(createBlogResponse.status).json(createBlogResponse);
    }
    catch (error) {
        return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
});
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title = '', content = '' } = req.body;
        const { blogId } = req.params;
        if (!blogId) {
            return res.status(httpStatusCodes_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
                message: 'Blog id is required.',
            });
        }
        if (!title && !content) {
            return res.status(httpStatusCodes_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
                message: 'Provide title or content to update.',
            });
        }
        const updateBlogResponse = yield blogService.updateBlog({ title, content }, blogId, req.userId);
        return res.status(updateBlogResponse.status).json(updateBlogResponse);
    }
    catch (error) {
        return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
});
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogId } = req.params;
        if (!blogId) {
            return res.status(httpStatusCodes_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
                message: 'Blog id is required.',
            });
        }
        const deleteBlogResponse = yield blogService.deleteBlog(blogId, req.userId);
        return res.status(deleteBlogResponse.status).json(deleteBlogResponse);
    }
    catch (error) {
        return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
});
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllBlogsResponse = yield blogService.getAllBlogs(req.userId);
        return res.status(getAllBlogsResponse.status).json(getAllBlogsResponse);
    }
    catch (error) {
        return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
});
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogId } = req.params;
        if (!blogId) {
            return res.status(httpStatusCodes_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
                message: 'Blog id is required.',
            });
        }
        const getBlogResponse = yield blogService.getBlogById(blogId, req.userId);
        return res.status(getBlogResponse.status).json(getBlogResponse);
    }
    catch (error) {
        return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
});
blogRouter.post('/', authUtils_1.isUserLoggedIn, createBlog);
blogRouter.put('/:blogId', authUtils_1.isUserLoggedIn, updateBlog);
blogRouter.delete('/:blogId', authUtils_1.isUserLoggedIn, deleteBlog);
// for all users to see blogs
blogRouter.get('/public', getAllBlogs);
blogRouter.get('/public/:blogId', getBlogById);
// for user-specific blogs
blogRouter.get('/', authUtils_1.isUserLoggedIn, getAllBlogs);
blogRouter.get('/:blogId', authUtils_1.isUserLoggedIn, getBlogById);
exports.default = blogRouter;
