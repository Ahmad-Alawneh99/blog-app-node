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
exports.getUserData = exports.signIn = exports.registerUser = void 0;
const bcrypt = __importStar(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const httpStatusCodes_1 = require("../shared/httpStatusCodes");
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt.hash(userData.password, 16);
        const user = new user_1.default({ email: userData.email, password: hashedPassword, name: userData.name });
        yield user.save();
        return {
            success: true,
            status: httpStatusCodes_1.HttpStatus.CREATED,
            userId: user._id,
        };
    }
    catch (error) {
        if (error.code === 11000) { // MongoDB error for a duplicate field (in this case, email, since it is supposed to be unique)
            return {
                success: false,
                status: httpStatusCodes_1.HttpStatus.CONFLICT,
                message: 'Email already exists.',
            };
        }
        else {
            return {
                success: false,
                status: httpStatusCodes_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            };
        }
    }
});
exports.registerUser = registerUser;
const signIn = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email });
    const invalidDataResponse = {
        success: false,
        status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
        message: 'Invalid email or password.',
    };
    if (!user) {
        return invalidDataResponse;
    }
    const isPasswordValid = yield bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return invalidDataResponse;
    }
    return { success: true, status: httpStatusCodes_1.HttpStatus.OK, userId: user._id };
});
exports.signIn = signIn;
const getUserData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ _id: userId }).select('-password');
    if (!user) {
        return {
            status: httpStatusCodes_1.HttpStatus.BAD_REQUEST,
            message: 'Profile info not found.',
            success: false,
        };
    }
    return {
        user,
        success: true,
        status: httpStatusCodes_1.HttpStatus.OK,
    };
});
exports.getUserData = getUserData;
