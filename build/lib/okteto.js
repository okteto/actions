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
const path = require("path");
const fs = require("fs");
const toolCache = require("@actions/tool-cache");
const toolName = 'okteto';
exports.version = '1.5.5';
const stableVersionUrl = `https://s3-us-west-2.amazonaws.com/downloads.okteto.com/cli/${exports.version}/okteto-Linux-x86_64`;
function downloadOkteto() {
    return __awaiter(this, void 0, void 0, function* () {
        let cachedToolpath = toolCache.find(toolName, exports.version);
        let downloadPath = '';
        if (!cachedToolpath) {
            try {
                console.log(`downloading ${stableVersionUrl}`);
                downloadPath = yield toolCache.downloadTool(stableVersionUrl);
            }
            catch (exception) {
                throw new Error(`failed to download: ${exception}`);
            }
            cachedToolpath = yield toolCache.cacheFile(downloadPath, toolName, toolName, exports.version);
        }
        const oktetoPath = path.join(cachedToolpath, toolName);
        fs.chmodSync(oktetoPath, '777');
        return oktetoPath;
    });
}
exports.downloadOkteto = downloadOkteto;
