"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
const product_1 = __importDefault(require("./product"));
const tag_1 = __importDefault(require("./tag"));
class ProductsTag extends sequelize_1.Model {
}
ProductsTag.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }
}, { sequelize: database_1.default });
tag_1.default.belongsToMany(product_1.default, { through: "ProductsTag" });
product_1.default.belongsToMany(tag_1.default, { through: "ProductsTag" });
exports.default = ProductsTag;
