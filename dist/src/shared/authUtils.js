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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserLoggedIn = void 0;
const tokenUtils = __importStar(require("./tokenUtils"));
const httpStatusCodes_1 = require("./httpStatusCodes");
const isUserLoggedIn = (req, res, next) => {
    var _a;
    const cookies = req.headers.cookie || '';
    try {
        const blogAppToken = ((_a = cookies.split(';').find((cookie) => cookie.trim().startsWith('blog_app_token'))) === null || _a === void 0 ? void 0 : _a.split('=')[1]) || '';
        const validatedToken = tokenUtils.verifyToken(blogAppToken);
        req.userId = validatedToken.id;
        return next();
    }
    catch (error) {
        return res.status(httpStatusCodes_1.HttpStatus.UNAUTHORIZED).send({ success: false, status: httpStatusCodes_1.HttpStatus.UNAUTHORIZED, message: 'Authentication required' });
    }
};
exports.isUserLoggedIn = isUserLoggedIn;
