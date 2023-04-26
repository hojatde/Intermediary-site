"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
require('dotenv').config();
process.env['APP_PATH'] = path_1.default.join(__dirname, '../');
const APP_PATH = process.env.APP_PATH || '';
const APP_PORT = process.env.APP_PORT || 8000;
const database_1 = __importDefault(require("./utils/database"));
const product_1 = __importDefault(require("./models/product"));
const category_1 = __importDefault(require("./models/category"));
const refrences_1 = __importDefault(require("./models/refrences"));
const tag_1 = __importDefault(require("./models/tag"));
const ProductsTag_1 = __importDefault(require("./models/ProductsTag"));
const config_1 = __importDefault(require("./models/config"));
const user_1 = __importDefault(require("./router/user"));
const common_1 = require("./controller/user/common");
category_1.default;
product_1.default;
refrences_1.default;
tag_1.default;
ProductsTag_1.default;
config_1.default;
common_1.CreateRoadMapCronJob;
const app = (0, express_1.default)();
app.use('/public/', express_1.default.static(path_1.default.join(APP_PATH, 'public/')));
app.use('/images/', express_1.default.static(path_1.default.join(APP_PATH, 'public/images/')));
app.use('/sitemap/', express_1.default.static(path_1.default.join(APP_PATH, 'public/sitemap/')));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, connect_flash_1.default)());
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use((0, express_session_1.default)({ secret: '123', resave: false, saveUninitialized: true, cookie: { maxAge: 3600000 } }));
app.use((req, res, next) => {
    config_1.default.findOne({ where: { hostName: req.hostname } })
        .then(config => {
        if (!config || !config.backGroundColor || !config.frontColor) {
            res.locals.backGroundColor = "#343a40";
            res.locals.frontColor = "#e9ecef";
            return next();
        }
        else {
            res.locals.backGroundColor = config.backGroundColor;
            res.locals.frontColor = config.frontColor;
            return next();
        }
    });
});
app.use(user_1.default);
app.use((req, res) => {
    res.render('users/404', {
        PageTitle: '404',
    });
});
database_1.default.sync({ force: false })
    .then((res) => {
    app.listen(APP_PORT, () => {
        console.log(`server run on ${APP_PORT}`);
    });
})
    .catch(err => {
    console.log(err);
});
