"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
class Config extends sequelize_1.Model {
}
Config.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, hostName: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }, homePageContent: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }, keywords: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }, description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }, title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    }, category: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    }, typeProduct: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    }, backGroundColor: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    }, frontColor: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    }, rules: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }, aboutUs: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
}, { sequelize: database_1.default });
exports.default = Config;
