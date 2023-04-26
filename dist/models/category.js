"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
class Category extends sequelize_1.Model {
}
Category.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    }, status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, { sequelize: database_1.default });
Category.belongsTo(Category, { foreignKey: 'parentId', as: "parent" });
Category.hasMany(Category, { foreignKey: 'parentId', as: "childs" });
exports.default = Category;
