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
exports.stableKubectlVersion = 'v1.15.0';
const kubectlToolName = 'kubectl';
const stableVersionUrl = `https://storage.googleapis.com/kubernetes-release/release/${exports.stableKubectlVersion}/bin/linux/amd64/kubectl`;
function downloadKubectl() {
    return __awaiter(this, void 0, void 0, function* () {
        let cachedToolpath = toolCache.find(kubectlToolName, exports.stableKubectlVersion);
        let kubectlDownloadPath = '';
        if (!cachedToolpath) {
            try {
                kubectlDownloadPath = yield toolCache.downloadTool(stableVersionUrl);
            }
            catch (exception) {
                throw new Error('DownloadKubectlFailed');
            }
            cachedToolpath = yield toolCache.cacheFile(kubectlDownloadPath, kubectlToolName, kubectlToolName, exports.stableKubectlVersion);
        }
        const kubectlPath = path.join(cachedToolpath, kubectlToolName);
        fs.chmodSync(kubectlPath, '777');
        return kubectlPath;
    });
}
exports.downloadKubectl = downloadKubectl;
