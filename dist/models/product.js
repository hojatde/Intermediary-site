"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const category_1 = __importDefault(require("./category"));
const sequelize_1 = require("sequelize");
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    }, description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    }, imageUrl: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    }, linkUrl: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    }, countOfView: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }, countOfRedirect: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, { sequelize: database_1.default });
Product.belongsTo(category_1.default);
category_1.default.hasMany(Product);
exports.default = Product;
