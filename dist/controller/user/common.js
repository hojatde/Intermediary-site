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
exports.CreateRoadMapCronJob = exports.get500Page = exports.get422Page = exports.test = exports.postContactUs = exports.rules = exports.aboutUs = exports.contactUs = void 0;
const express_validator_1 = require("express-validator");
const node_cron_1 = __importDefault(require("node-cron"));
const contactUs_1 = __importDefault(require("../../models/contactUs"));
const product_1 = __importDefault(require("../../models/product"));
const tag_1 = __importDefault(require("../../models/tag"));
const config_1 = __importDefault(require("../../models/config"));
const contactUs = (req, res) => {
    res.render("users/contactus", {
        'PageTitle': 'تماس با ما',
        errorMessege: req.flash('error')
    });
};
exports.contactUs = contactUs;
const aboutUs = (req, res) => {
    config_1.default.findOne({ where: { hostName: req.hostname } })
        .then(config => {
        if (!config) {
            return res.redirect('/');
        }
        res.render("users/aboutUs", {
            'PageTitle': config.title + '-' + 'درباره با ما',
            content: config === null || config === void 0 ? void 0 : config.aboutUs
        });
    }).catch(err => console.log(err));
};
exports.aboutUs = aboutUs;
const rules = (req, res) => {
    config_1.default.findOne({ where: { hostName: req.hostname } })
        .then(config => {
        if (!config) {
            return res.redirect('/');
        }
        res.render("users/rules", {
            'PageTitle': config.title + '-' + 'قوانین',
            content: config === null || config === void 0 ? void 0 : config.rules
        });
    }).catch(err => console.log(err));
};
exports.rules = rules;
const postContactUs = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('back');
    }
    const inputTitle = req.body.title;
    const inputFullName = req.body.fullName;
    const inputPhoneNumber = req.body.phoneNumber;
    const inputEmail = req.body.email;
    const inputDescription = req.body.description;
    const inputCode = req.body.code;
    if (!inputFullName || !inputTitle || !inputDescription || !inputCode || !req.session.captchaCode) {
        return res.redirect('/');
    }
    else if (inputCode.toString() !== req.session.captchaCode.toString()) {
        req.flash('error', 'کد کپچا را صحیح وارد کنید.');
        return res.redirect('back');
    }
    else {
        contactUs_1.default.create({
            fullName: inputFullName,
            title: inputTitle,
            phoneNumber: inputPhoneNumber || null,
            email: inputEmail || null,
            description: inputDescription
        })
            .then(result => {
            res.redirect('/');
        })
            .catch(err => {
            console.log(err);
        });
    }
};
exports.postContactUs = postContactUs;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(req.hostname.split('.')[0]);
});
exports.test = test;
const get422Page = (req, res) => {
    res.status(422).render('users/422.ejs', {
        PageTitle: 'تلاش برای دسترسی غیر مجاز',
        errorMessege: req.flash('error')
    });
};
exports.get422Page = get422Page;
const get500Page = (req, res) => {
    res.status(422).render('users/500.ejs', {
        PageTitle: 'سرور در حال به روز رسانی است.',
    });
};
exports.get500Page = get500Page;
const CreateRoadMapCronJob = () => {
    node_cron_1.default.schedule('* * 2 * * *', () => {
        const { createWriteStream } = require('fs');
        const { resolve } = require('path');
        const { createGzip } = require('zlib');
        const { SitemapAndIndexStream, SitemapStream, } = require('sitemap');
        const sms = new SitemapAndIndexStream({
            limit: 45000,
            getSitemapStream: (i) => {
                const sitemapStream = new SitemapStream({
                    hostname: 'https://example.ru/',
                });
                const path = `public/sitemap/sitemap-${i}.xml`;
                const ws = createWriteStream(resolve(path));
                sitemapStream
                    .pipe(ws);
                return [
                    new URL(path, 'https://example.com/subdir/').toString(),
                    sitemapStream,
                    ws,
                ];
            },
        });
        sms
            .pipe(createWriteStream(resolve('./public/sitemap/sitemap-index.xml')));
        product_1.default.findAll()
            .then(products => {
            for (let i = 0; i < 1; i++) {
                products.forEach(product => {
                    sms.write({
                        url: 'product/' + product.id + '/' + product.title.replaceAll(' ', '-'),
                        changefreq: 'weekly',
                        priority: 0.8,
                        lastmod: product.updatedAt
                    });
                });
                tag_1.default.findAll()
                    .then(tags => {
                    tags.forEach(tag => {
                        sms.write({
                            url: 'products?tagTitle=' + tag.title,
                            changefreq: 'weekly',
                            priority: 0.8,
                            lastmod: tag.updatedAt,
                        });
                    });
                    sms.end();
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }, {
        timezone: 'Asia/Tehran'
    });
};
exports.CreateRoadMapCronJob = CreateRoadMapCronJob;
