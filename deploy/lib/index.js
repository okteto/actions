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
const fs = require("fs");
const yaml = require("js-yaml");
const core = require("@actions/core");
const toolrunner_1 = require("@actions/exec/lib/toolrunner");
const toolCache = require("@actions/tool-cache");
const kubectl_1 = require("./kubectl");
let kubectlPath = "";
function getKubectl() {
    return __awaiter(this, void 0, void 0, function* () {
        kubectlPath = toolCache.find('kubectl', kubectl_1.stableKubectlVersion);
        if (!kubectlPath) {
            kubectlPath = yield kubectl_1.downloadKubectl();
        }
    });
}
function checkDeploy(name, namespace) {
    return __awaiter(this, void 0, void 0, function* () {
        const toolrunner = new toolrunner_1.ToolRunner(kubectlPath, ['rollout', 'status', name, `--namespace`, namespace]);
        return toolrunner.exec();
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let toolRunner = new toolrunner_1.ToolRunner('/bin/ls', ['-la']);
        yield toolRunner.exec();
        let namespace = core.getInput('namespace');
        if (!namespace) {
            core.setFailed('No namespace supplied');
        }
        let manifestsInput = core.getInput('manifests');
        if (!manifestsInput) {
            core.setFailed('No manifests supplied');
        }
        console.log(`KUBECONFIG environment variable is set: ${process.env.KUBECONFIG}`);
        yield getKubectl();
        let manifests = manifestsInput.split('\n');
        //const images = core.getInput('images');
        //if (!!images) {
        //    manifests = updateManifests(manifests, images)
        //}
        for (var i = 0; i < manifests.length; i++) {
            let toolRunner = new toolrunner_1.ToolRunner(kubectlPath, ['apply', '-f', manifests[i], '--namespace', namespace]);
            yield toolRunner.exec();
        }
        for (var i = 0; i < manifests.length; i++) {
            let content = fs.readFileSync(manifests[i]).toString();
            yaml.safeLoadAll(content, function (m) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!!m.kind && !!m.metadata && !!m.metadata.name) {
                        let kind = m.kind;
                        switch (kind.toLowerCase()) {
                            case 'deployment':
                            case 'daemonset':
                            case 'statefulset':
                                const name = `${kind.trim()}/${m.metadata.name.trim()}`;
                                yield checkDeploy(name, namespace);
                                return;
                            default:
                                return;
                        }
                    }
                });
            });
        }
        core.setOutput("url", `https://cloud.okteto.com/#/spaces/${namespace}`);
    });
}
run().catch(core.setFailed);
