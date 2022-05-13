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
exports.action = void 0;
const api_1 = require("./api");
const puppeteer_1 = require("./puppeteer");
const storybook_1 = require("./storybook");
const puppeteer_2 = __importDefault(require("puppeteer"));
const action = (branch, storybookBaseUrl, publishBaseUrl, publishKey, logging) => __awaiter(void 0, void 0, void 0, function* () {
    logging.info(`Reading stories from: ${storybookBaseUrl}`);
    const stories = yield (0, storybook_1.getStorybooks)(storybookBaseUrl);
    logging.info(` - found ${stories.length} stories`);
    const browser = yield puppeteer_2.default.launch();
    logging.info("Reading accessibility trees");
    let accessibilityTrees = [];
    let i = 0;
    for (const story of stories) {
        if (i % 10 === 0)
            logging.info(` - Progress ${i} out of ${stories.length}`);
        i++;
        accessibilityTrees.push({
            component: story,
            tree: yield (0, puppeteer_1.getAccessibilityTree)(browser, (0, storybook_1.getStorybookComponentUrl)(storybookBaseUrl, story), "#root"),
        });
    }
    logging.info(` - Done reading accessibility trees`);
    yield browser.close();
    logging.info(`Publishing build to: ${publishBaseUrl}`);
    yield (0, api_1.publish)({
        branch: branch,
        results: accessibilityTrees,
    }, publishBaseUrl, publishKey);
    logging.info(` - Published!`);
});
exports.action = action;
