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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessibilityTree = void 0;
const removeNones = (nodes) => {
    if (nodes === undefined) {
        return [];
    }
    var newNodes = [];
    for (const node of nodes) {
        if (node.role === "none") {
            newNodes = newNodes.concat(removeNones(node.children));
        }
        else {
            node.children = removeNones(node.children);
            newNodes.push(node);
        }
    }
    return newNodes;
};
const getAccessibilityTree = (browser, url, selector) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield browser.newPage();
    yield page.goto(url);
    const hrefElement = yield page.$(selector);
    if (hrefElement === null) {
        return [];
    }
    const snapshot = yield page.accessibility.snapshot({
        interestingOnly: false,
    });
    yield page.close();
    return removeNones(snapshot.children);
});
exports.getAccessibilityTree = getAccessibilityTree;
