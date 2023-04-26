"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
class ContactUs extends sequelize_1.Model {
}
ContactUs.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, title: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    }, fullName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    }, email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    }, phoneNumber: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    }, description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
}, { sequelize: database_1.default });
exports.default = ContactUs;
