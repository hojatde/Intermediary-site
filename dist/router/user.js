"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controller/user/products");
const common_1 = require("../controller/user/common");
const express_validator_1 = require("express-validator");
const customPatternForWords = /^[^!@#$^*<&>{}]+$/;
const customPatternForNumber = /^[^!@#$^&*<>{}]+$/;
const customPatternForPhoneNumber = /^[0-9]{10}$/;
const customPatternForPhoneCode = /^[0-9]{4}$/;
const userRouter = (0, express_1.Router)();
userRouter.get('/', products_1.getHome);
userRouter.get('/products', [
    (0, express_validator_1.query)('bookTitle').optional({ nullable: false }).matches(customPatternForWords).withMessage('عنوان محصول تنها میتواند شامل حروف،اعداد و فاصله باشد.'),
    (0, express_validator_1.query)('bookCategoryId').optional({ nullable: false }).matches(customPatternForWords).withMessage('دسته بندی محصول تنها میتواند شامل حروف و فاصله باشد.'),
    (0, express_validator_1.query)('tagId').optional({ nullable: false }).matches(customPatternForWords).withMessage('برچسب محصول تنها میتواند شامل حروف و فاصله باشد.'),
    (0, express_validator_1.query)('page').optional({ nullable: false }).isNumeric().withMessage('شماره تنها میتوند شامل اعداد باشه'),
], products_1.getProducts);
userRouter.get('/product/:productId/:productSlug', [
    (0, express_validator_1.param)('productId').isInt({ max: 999999999, min: 0 }).withMessage('شناسه محصول تنها شامل اعداد است.')
], products_1.getProductIndex);
userRouter.get('/verifyVisitProduct', [
    (0, express_validator_1.query)('code').isInt().withMessage('کد وارد شده صحیح نیست.'),
    (0, express_validator_1.query)('productId').isInt({ max: 9999, min: 1 }).withMessage('محصولی با کد وارد شده در سیستم ثبت نشده است.')
], products_1.getVerifyVisitProduct);
userRouter.get('/download/:productId/:productSlug', [
    (0, express_validator_1.param)('productId').isInt({ max: 9999, min: 1 }).withMessage('محصولی با کد وارد شده در سیستم ثبت نشده است.'),
    (0, express_validator_1.param)('productSlug').matches(customPatternForWords).withMessage('عنوان محصول تنها میتواند شامل حروف،اعداد و فاصله باشد.')
], products_1.getVerifyDownloadProduct);
userRouter.post('/download/:productId/:productSlug', [
    (0, express_validator_1.param)('productId').isInt().withMessage('محصولی با کد وارد شده در سیستم ثبت نشده است.'),
    (0, express_validator_1.body)('code').isInt().withMessage('کد وارد شده صحیح نیست.')
], products_1.postVerifyDownloadProduct);
userRouter.get('/captcha', products_1.getCaptcha);
userRouter.get('/422', common_1.get422Page);
userRouter.get('/contactUs', common_1.contactUs);
userRouter.get('/aboutUs', common_1.aboutUs);
userRouter.get('/rules', common_1.rules);
userRouter.post('/contactUs', [
    (0, express_validator_1.body)('fullName').matches(customPatternForWords).withMessage('نام ونام خانوادگی تنها میتواند شامل حروف،اعداد و فاصله باشد.'),
    (0, express_validator_1.body)('title').matches(customPatternForWords).withMessage('عنوان تنها میتواند شامل حروف باشد'),
    (0, express_validator_1.body)('description').matches(customPatternForWords).withMessage('توضیحات تنها میتواند شامل حروف،اعداد و فاصله باشد.'),
    (0, express_validator_1.body)('phoneNumber').matches(customPatternForPhoneNumber).withMessage('تلفن همراه تنها شامل 10 رقم است.'),
    (0, express_validator_1.body)('email').optional({ checkFalsy: true }).matches(customPatternForWords).withMessage('ایمیل نا معتبر،لطفا دوباره تلاش کنید.'),
    (0, express_validator_1.body)('code').optional({ checkFalsy: true }).isNumeric().withMessage('کد کپچا تنها شامل اعداد است.')
], common_1.postContactUs);
userRouter.get('/500', common_1.get500Page);
userRouter.get('/test', common_1.test);
exports.default = userRouter;
