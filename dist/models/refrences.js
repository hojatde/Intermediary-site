"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
const product_1 = __importDefault(require("./product"));
class Refrence extends sequelize_1.Model {
}
Refrence.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, referrer: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    }, ip: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    }
}, { sequelize: database_1.default });
Refrence.belongsTo(product_1.default);
product_1.default.hasMany(Refrence);
exports.default = Refrence;
