"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStrongPassword = exports.isValidEmail = void 0;
const isValidEmail = (email = '') => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isStrongPassword = (password = '') => {
    if (password.length < 8 || password.length > 16) {
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    if (!/\d/.test(password)) {
        return false;
    }
    if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password)) {
        return false;
    }
    return true;
};
exports.isStrongPassword = isStrongPassword;
