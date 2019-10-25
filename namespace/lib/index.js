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
const core = require("@actions/core");
const command_1 = require("@actions/core/lib/command");
const toolCache = require("@actions/tool-cache");
const okteto_1 = require("./okteto");
const toolrunner_1 = require("@actions/exec/lib/toolrunner");
function setOkteto() {
    return __awaiter(this, void 0, void 0, function* () {
        let oktetoPath = toolCache.find('okteto', okteto_1.version);
        if (!oktetoPath) {
            oktetoPath = yield okteto_1.downloadOkteto();
            yield makeExecutable(oktetoPath);
        }
        return oktetoPath;
    });
}
function makeExecutable(oktetoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let toolRunner = new toolrunner_1.ToolRunner('/bin/chmod', ['+x', oktetoPath]);
        yield toolRunner.exec();
    });
}
function setNamespace(path, namespace, token) {
    return __awaiter(this, void 0, void 0, function* () {
        let toolRunner = new toolrunner_1.ToolRunner(path, ['namespace', namespace], {
            env: {
                "OKTETO_TOKEN": token,
            }
        });
        yield toolRunner.exec();
    });
}
function setKubeconfig() {
    const kubeconfigPath = path.join('.', `.kube/config`);
    command_1.issueCommand('set-env', { name: 'KUBECONFIG' }, kubeconfigPath);
    console.log(`KUBECONFIG environment variable is set`);
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let token = core.getInput('token');
        if (!token) {
            core.setFailed('No token supplied');
        }
        let namespace = core.getInput('namespace');
        if (!namespace) {
            core.setFailed('No namespace supplied');
        }
        const oktetoPath = yield setOkteto();
        console.log(`okteto available at: ${oktetoPath}`);
        yield setNamespace(oktetoPath, namespace, token);
        setKubeconfig();
    });
}
run().catch(core.setFailed);
