"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaptcha = exports.postVerifyDownloadProduct = exports.getVerifyDownloadProduct = exports.getVerifyVisitProduct = exports.getProductIndex = exports.getProducts = exports.getHome = void 0;
const validation_result_1 = require("express-validator/src/validation-result");
const sequelize_1 = require("sequelize");
const category_1 = __importDefault(require("../../models/category"));
const config_1 = __importDefault(require("../../models/config"));
const product_1 = __importDefault(require("../../models/product"));
const tag_1 = __importDefault(require("../../models/tag"));
const querystring_1 = __importDefault(require("querystring"));
const url_1 = __importDefault(require("url"));
var svgCaptcha = require('svg-captcha');
svgCaptcha.options.charPreset = '0123456789';
const countOfProductsInPage = 20;
const getHome = (req, res) => {
    config_1.default.findOne({ where: { hostName: req.hostname } })
        .then(config => {
        if (!config) {
            return res.send('config not set.');
        }
        return res.render('users/home', {
            'PageTitle': config.title,
            'homePageContent': config.homePageContent,
            'metaTags': [
                { 'name': 'keywords', 'content': config.keywords },
                { 'name': 'description', 'content': config.description },
            ],
            description: config.description,
        });
    });
};
exports.getHome = getHome;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.headers.referer) {
        req.session.reffere = req.headers.referer;
    }
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'ورودی نا معتبر');
        return res.redirect('/422');
    }
    let inputTitle = '';
    let inputCategoryId = '';
    let inputTagTitle = "";
    let pageNumber = 1;
    if (req.query.page) {
        pageNumber = parseInt(req.query.page.toString());
    }
    if (req.query.bookTitle) {
        inputTitle = req.query.bookTitle.toString();
    }
    else if (req.query.bookCategoryId) {
        inputCategoryId = req.query.bookCategoryId.toString().replaceAll('-', ' ');
    }
    else if (req.query.tagTitle) {
        inputTagTitle = req.query.tagTitle.toString().replaceAll('-', ' ');
    }
    const config = yield config_1.default.findOne({ where: { hostName: req.hostname } });
    const categories = yield category_1.default.findOne({ where: { id: config === null || config === void 0 ? void 0 : config.category.toString(), status: true }, include: [{ model: category_1.default, as: 'childs', required: false, where: { status: true }, include: [{ model: category_1.default, as: "childs", required: false, where: { status: true }, include: [{ model: category_1.default, as: "childs", required: false, where: { status: true } }] }] }] });
    if (!categories) {
        req.flash('error', 'هیچ دسته بندی ثبت نشده است.');
        return res.redirect('/422');
    }
    let categoriesTitle = [];
    categoriesTitle.push(categories.id);
    (_a = categories.childs) === null || _a === void 0 ? void 0 : _a.forEach(child => {
        categoriesTitle.push(child.id);
        if (child.childs) {
            child.childs.forEach(child1 => {
                categoriesTitle.push(child1.id);
                if (child1.childs) {
                    child1.childs.forEach(child2 => {
                        categoriesTitle.push(child2.id);
                    });
                }
            });
        }
    });
    console.log(categoriesTitle);
    if (!inputTitle && !inputCategoryId && !inputTagTitle) {
        product_1.default.findAndCountAll({ offset: pageNumber * countOfProductsInPage, where: { categoryId: { [sequelize_1.Op.in]: categoriesTitle } }, limit: countOfProductsInPage, order: [['createdAt', 'DESC']] })
            .then(result => {
            const listLength = result.count;
            const products = result.rows;
            var parsedQuery = url_1.default.parse(req.url, true).query;
            let nextPageUrl;
            let previousPageUrl;
            if (parsedQuery.page) {
                const nextPageNumber = parseInt(parsedQuery.page.toString()) + 1;
                const previousPageNumber = parseInt(parsedQuery.page.toString()) - 1;
                parsedQuery.page = nextPageNumber.toString();
                nextPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery);
                parsedQuery.page = previousPageNumber.toString();
                previousPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery);
            }
            else {
                nextPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery) + '&page=2';
                previousPageUrl = '';
            }
            if (products) {
                res.render("users/product/list", {
                    'PageTitle': 'محصولات',
                    products, categories: categories.childs ? categories.childs : null, typeProduct: config === null || config === void 0 ? void 0 : config.typeProduct, pageNumber,
                    hasNextPage: (pageNumber + 1) * countOfProductsInPage < listLength ? true : false,
                    hasPreviousPage: pageNumber !== 1 ? true : false, nextPageUrl, previousPageUrl
                });
            }
            else {
                return res.redirect('/500');
            }
        });
    }
    else if (inputTitle) {
        product_1.default.findAndCountAll({ offset: pageNumber * countOfProductsInPage, limit: countOfProductsInPage, where: { title: { [sequelize_1.Op.like]: '%' + inputTitle + '%' } }, order: [['createdAt', 'DESC']] })
            .then(result => {
            const listLength = result.count;
            const products = result.rows;
            var parsedQuery = url_1.default.parse(req.url, true).query;
            let nextPageUrl;
            let previousPageUrl;
            if (parsedQuery.page) {
                const nextPageNumber = parseInt(parsedQuery.page.toString()) + 1;
                const previousPageNumber = parseInt(parsedQuery.page.toString()) - 1;
                parsedQuery.page = nextPageNumber.toString();
                nextPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery);
                parsedQuery.page = previousPageNumber.toString();
                previousPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery);
            }
            else {
                nextPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery) + '&page=2';
                previousPageUrl = '';
            }
            if (products) {
                res.render("users/product/list", {
                    'PageTitle': 'محصولات',
                    products, categories: categories.childs ? categories.childs : null, typeProduct: config === null || config === void 0 ? void 0 : config.typeProduct,
                    pageNumber,
                    hasNextPage: (pageNumber + 1) * countOfProductsInPage < listLength ? true : false,
                    hasPreviousPage: pageNumber !== 1 ? true : false, nextPageUrl, previousPageUrl
                });
            }
            else {
                return res.redirect('/500');
            }
        });
    }
    else if (inputCategoryId) {
        category_1.default.findOne({ where: { title: inputCategoryId } })
            .then(category => {
            if (!category) {
                return res.redirect('/');
            }
            product_1.default.findAndCountAll({
                offset: pageNumber * countOfProductsInPage, limit: countOfProductsInPage, where: {
                    [sequelize_1.Op.or]: [
                        { categoryId: category.id }
                    ]
                }, order: [['createdAt', 'DESC']]
            })
                .then(result => {
                const listLength = result.count;
                const products = result.rows;
                var parsedQuery = url_1.default.parse(req.url, true).query;
                let nextPageUrl;
                let previousPageUrl;
                if (parsedQuery.page) {
                    const nextPageNumber = parseInt(parsedQuery.page.toString()) + 1;
                    const previousPageNumber = parseInt(parsedQuery.page.toString()) - 1;
                    parsedQuery.page = nextPageNumber.toString();
                    nextPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery);
                    parsedQuery.page = previousPageNumber.toString();
                    previousPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery);
                }
                else {
                    nextPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery) + '&page=2';
                    previousPageUrl = '';
                }
                if (products) {
                    res.render("users/product/list", {
                        'PageTitle': 'محصولات',
                        products, categories: categories.childs ? categories.childs : null, typeProduct: config === null || config === void 0 ? void 0 : config.typeProduct,
                        pageNumber,
                        hasNextPage: (pageNumber + 1) * countOfProductsInPage < listLength ? true : false,
                        hasPreviousPage: pageNumber !== 1 ? true : false, nextPageUrl, previousPageUrl
                    });
                }
                else {
                    return res.redirect('/500');
                }
            });
        });
    }
    else if (inputTagTitle) {
        tag_1.default.findOne({ where: { title: inputTagTitle }, include: product_1.default })
            .then(tag => {
            let products = tag === null || tag === void 0 ? void 0 : tag.Products;
            if (!products) {
                req.flash('error', 'دسته بندی نا معتبر');
                return res.redirect('/422');
            }
            const listLength = products.length;
            products = products.slice((pageNumber - 1) * countOfProductsInPage, pageNumber * countOfProductsInPage);
            var parsedQuery = url_1.default.parse(req.url, true).query;
            let nextPageUrl;
            let previousPageUrl;
            if (parsedQuery.page) {
                const nextPageNumber = parseInt(parsedQuery.page.toString()) + 1;
                const previousPageNumber = parseInt(parsedQuery.page.toString()) - 1;
                parsedQuery.page = nextPageNumber.toString();
                nextPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery);
                parsedQuery.page = previousPageNumber.toString();
                previousPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery);
            }
            else {
                nextPageUrl = req.path + '?' + querystring_1.default.stringify(parsedQuery) + '&page=2';
                previousPageUrl = '';
            }
            if (products) {
                res.render("users/product/list", {
                    'PageTitle': 'محصولات',
                    products: products, categories: categories.childs ? categories.childs : null, typeProduct: config === null || config === void 0 ? void 0 : config.typeProduct,
                    pageNumber,
                    hasNextPage: (pageNumber) * countOfProductsInPage < listLength ? true : false,
                    hasPreviousPage: pageNumber !== 1 ? true : false, nextPageUrl, previousPageUrl
                });
            }
            else {
                req.flash('error', 'دسته بندی نا معتبر');
                res.redirect('/422');
            }
        });
    }
});
exports.getProducts = getProducts;
const getProductIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!req.session.reffere && req.headers.referer) {
        req.session.reffere = req.headers.referer;
    }
    const config = yield config_1.default.findOne({ where: { hostName: req.hostname } });
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('422');
    }
    const inputProductId = (_b = req.params.productId) === null || _b === void 0 ? void 0 : _b.toString();
    if (!inputProductId) {
        return res.redirect('/products');
    }
    else {
        product_1.default.findOne({ where: { id: inputProductId }, include: tag_1.default })
            .then(product => {
            var _a;
            if (!product)
                return res.redirect('/product');
            else {
                const tagsIdList = (_a = product === null || product === void 0 ? void 0 : product.Tags) === null || _a === void 0 ? void 0 : _a.map(tag => {
                    return tag.id;
                });
                product.countOfView++;
                product.save()
                    .then(updatedProduct => {
                    product_1.default.findAll({ include: { model: tag_1.default, where: { id: tagsIdList } }, limit: 5, where: {} })
                        .then(realtedProducts => {
                        realtedProducts = realtedProducts.filter(product => {
                            if (product.id.toString() !== inputProductId)
                                return product;
                        });
                        return res.render('users/product/index', {
                            'PageTitle': product.title,
                            product,
                            realtedProducts,
                            errorMessege: req.flash('error'),
                            typeProduct: config === null || config === void 0 ? void 0 : config.typeProduct
                        });
                    })
                        .catch(err => console.log(err));
                })
                    .catch(err => {
                    console.log(err);
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }
});
exports.getProductIndex = getProductIndex;
const getVerifyVisitProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'ورودی نا معتبر');
        return res.redirect('/422');
    }
    const config = yield config_1.default.findOne({ where: { hostName: req.hostname } });
    if (config === null || config === void 0 ? void 0 : config.typeProduct) {
        return res.redirect('/products');
    }
    const inputCode = (_c = req.query.code) === null || _c === void 0 ? void 0 : _c.toString();
    const inputProductId = req.query.productId;
    if (!inputCode || !req.session.captchaCode || !inputProductId) {
        res.redirect('/products');
    }
    else {
        console.log(req.session.captchaCode);
        console.log(req.session.captchaCode.indexOf(inputCode));
        if (req.session.captchaCode.indexOf(inputCode) < 0) {
            req.flash('error', 'کد کپچا را صحیح وارد کنید.');
            res.redirect('back');
        }
        else {
            const captchaSession = req.session.captchaCode.indexOf(inputCode);
            req.session.captchaCode = req.session.captchaCode.splice(captchaSession, 1);
            product_1.default.findOne({ where: { id: inputProductId.toString() } })
                .then(product => {
                if (product && product.linkUrl) {
                    product.countOfRedirect++;
                    product.save()
                        .then(updatedProduct => {
                        product.createRefrence({
                            ip: req.ip.toString() || '',
                            referrer: req.session.reffere ? req.session.reffere : '',
                            productId: product.id
                        }).then(creaetdRefrence => {
                            return res.redirect(product.linkUrl);
                        }).catch(err => {
                            console.log(err);
                        });
                    })
                        .catch(err => console.log(err));
                }
                else {
                    req.session.captchaCode = undefined;
                    req.session.reffere = undefined;
                    return res.redirect('/products');
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }
});
exports.getVerifyVisitProduct = getVerifyVisitProduct;
const getVerifyDownloadProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield config_1.default.findOne({ where: { hostName: req.hostname } });
    if (!(config === null || config === void 0 ? void 0 : config.typeProduct)) {
        return res.redirect('/422');
    }
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'ورودی نا معتبر');
        return res.redirect('/422');
    }
    const inputProductId = req.params.productId;
    if (!inputProductId) {
        return res.redirect('/products');
    }
    product_1.default.findOne({ where: { id: inputProductId } })
        .then(product => {
        if (!product) {
            return res.redirect('/422');
        }
        return res.render('users/product/verifyDownloadProduct', {
            'PageTitle': product.title,
            product, errorMessage: req.flash('error'),
            typeProduct: config.typeProduct
        });
    }).catch(err => { console.log(err); });
});
exports.getVerifyDownloadProduct = getVerifyDownloadProduct;
const postVerifyDownloadProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield config_1.default.findOne({ where: { hostName: req.hostname } });
    if (!(config === null || config === void 0 ? void 0 : config.typeProduct)) {
        return res.redirect('/422');
    }
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'ورودی نا معتبر');
        return res.redirect('/422');
    }
    const inputProductId = req.params.productId;
    const inputCode = req.body.code;
    if (!inputCode || !req.session.captchaCode || !inputProductId) {
        return res.redirect('/products');
    }
    else {
        if (req.session.captchaCode.indexOf(inputCode) < 0) {
            req.flash('error', 'کد کپچا را صحیح وارد کنید.');
            res.redirect('back');
        }
        else {
            console.log('before', req.session.captchaCode);
            const captchaSession = req.session.captchaCode.indexOf(inputCode);
            req.session.captchaCode = req.session.captchaCode.splice(captchaSession, 1);
            console.log(captchaSession);
            console.log('after', req.session.captchaCode);
            product_1.default.findOne({ where: { id: inputProductId } })
                .then(product => {
                if (product && product.linkUrl) {
                    product.countOfRedirect++;
                    product.save()
                        .then(updatedProduct => {
                        product.createRefrence({
                            ip: req.ip.toString() || '',
                            referrer: req.session.reffere ? req.session.reffere : '',
                            productId: product.id
                        }).then(creaetdRefrence => {
                            return res.redirect(product.linkUrl);
                        }).catch(err => {
                            console.log(err);
                        });
                    })
                        .catch(err => console.log(err));
                }
                else {
                    req.session.captchaCode = undefined;
                    req.session.reffere = undefined;
                    return res.redirect('/products');
                }
            }).catch(err => { console.log(err); });
        }
    }
});
exports.postVerifyDownloadProduct = postVerifyDownloadProduct;
const getCaptcha = (req, res) => {
    var captcha = svgCaptcha.create();
    if (!req.session.captchaCode) {
        req.session.captchaCode = [];
    }
    else if (req.session.captchaCode.length > 10) {
        req.session.captchaCode = [];
    }
    req.session.captchaCode.push(captcha.text);
    res.status(200).json(captcha.data);
};
exports.getCaptcha = getCaptcha;
