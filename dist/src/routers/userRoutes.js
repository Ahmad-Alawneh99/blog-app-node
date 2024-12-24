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
const tokenUtils = __importStar(require("../shared/tokenUtils"));
const validationUtils = __importStar(require("../shared/validationUtils"));
const authUtils_1 = require("../shared/authUtils");
const httpStatusCodes_1 = require("../shared/httpStatusCodes");
const userService = __importStar(require("../services/userService"));
const userRouter = express_1.default.Router();
const handleUserSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        const validationErrorResponse = { success: false, status: httpStatusCodes_1.HttpStatus.BAD_REQUEST, message: '' };
        if (!validationUtils.isValidEmail(email)) {
            validationErrorResponse.message = 'Email is missing or invalid.';
        }
        if (!validationUtils.isStrongPassword(password)) {
            validationErrorResponse.message = 'Weak password.';
        }
        if (!name) {
            validationErrorResponse.message = 'Name is required.';
        }
        if (validationErrorResponse.message) {
            return res.status(httpStatusCodes_1.HttpStatus.BAD_REQUEST).json(validationErrorResponse);
        }
        const registerUserResponse = yield userService.registerUser({ email, name, password });
        if (registerUserResponse.success) {
            const token = tokenUtils.signToken({ email, id: registerUserResponse.userId });
            return res.status(httpStatusCodes_1.HttpStatus.CREATED).json({
                success: true,
                status: httpStatusCodes_1.HttpStatus.CREATED,
                token,
                userId: registerUserResponse.userId,
            });
        }
        else {
            return res.status(registerUserResponse.status).json(registerUserResponse);
        }
    }
    catch (error) {
        return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
});
const handleUserSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(httpStatusCodes_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
                message: 'Email and password are required.',
            });
        }
        const signInResponse = yield userService.signIn(email, password);
        if (signInResponse.success) {
            const token = tokenUtils.signToken({ id: signInResponse.userId, email });
            return res.status(httpStatusCodes_1.HttpStatus.OK).json({ success: true, status: httpStatusCodes_1.HttpStatus.OK, token });
        }
        else {
            return res.status(signInResponse.status).json(signInResponse);
        }
    }
    catch (error) {
        return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
});
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const getUserResponse = yield userService.getUserData(userId);
        return res.status(getUserResponse.status).json(getUserResponse);
    }
    catch (error) {
        return res.status(httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            status: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
});
userRouter.post('/sign-in', handleUserSignIn);
userRouter.post('/sign-up', handleUserSignup);
userRouter.get('/', authUtils_1.isUserLoggedIn, getUserData);
exports.default = userRouter;
