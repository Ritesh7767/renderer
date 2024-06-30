"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.route('/createBook').post(auth_middleware_1.default, book_controller_1.createBook);
router.route('/getBooks').get(auth_middleware_1.default, book_controller_1.getBooks);
exports.default = router;
