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
const core = require("@actions/core");
const toolCache = require("@actions/tool-cache");
const okteto_1 = require("./okteto");
const toolrunner_1 = require("@actions/exec/lib/toolrunner");
function setOkteto() {
    return __awaiter(this, void 0, void 0, function* () {
        let oktetoPath = toolCache.find('okteto', okteto_1.version);
        if (!oktetoPath) {
            oktetoPath = yield okteto_1.downloadOkteto();
            let toolRunner = new toolrunner_1.ToolRunner('/bin/chmod', ['+x', oktetoPath]);
            yield toolRunner.exec();
        }
        return oktetoPath;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let token = core.getInput('token');
        if (!token) {
            core.setFailed('No token supplied');
        }
        let tag = core.getInput('tag');
        if (!tag) {
            core.setFailed('No tag supplied');
        }
        let file = core.getInput('file');
        if (!file) {
            core.setFailed('No dockerfile supplied');
        }
        let buildPath = core.getInput('path');
        if (!buildPath) {
            core.setFailed('No path supplied');
        }
        const oktetoPath = yield setOkteto();
        console.log(`okteto available at: ${oktetoPath}`);
        let toolRunner = new toolrunner_1.ToolRunner('okteto', ['build', '-f', file, '-t', tag, buildPath]);
        yield toolRunner.exec();
    });
}
run().catch(core.setFailed);
