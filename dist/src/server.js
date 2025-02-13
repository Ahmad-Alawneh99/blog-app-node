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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const dbConnect_1 = require("./shared/dbConnect");
const userRoutes_1 = __importDefault(require("./routers/userRoutes"));
const blogRoutes_1 = __importDefault(require("./routers/blogRoutes"));
dotenv.config();
const app = (0, express_1.default)();
const port = 3030;
(0, dbConnect_1.connectToMongoDB)().catch((error) => console.log('failed to connect to mongodb', error));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    return res.send('Blog app backend');
});
app.use('/users', userRoutes_1.default);
app.use('/blogs', blogRoutes_1.default);
app.listen(port, () => {
    console.log(`Blog app listening on port ${port}`);
});
