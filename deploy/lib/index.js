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
const fs_1 = require("fs");
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
function kustomization(manifests, image, tag) {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.promises.writeFile('kustomization.yaml', yaml.safeDump({
            resources: manifests,
            images: {
                name: image,
                newName: image,
                newTag: tag
            }
        }));
    });
}
function waitForReady(manifests, namespace) {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i < manifests.length; i++) {
            let content = yield fs_1.promises.readFile(manifests[i]);
            const loaded = yaml.safeLoadAll(content.toString());
            for (var j = 0; j < loaded.length; j++) {
                const m = loaded[j];
                if (!!m.kind && !!m.metadata && !!m.metadata.name) {
                    let kind = m.kind;
                    switch (kind.toLowerCase()) {
                        case 'deployment':
                        case 'daemonset':
                        case 'statefulset':
                            const name = `${kind.trim()}/${m.metadata.name.trim()}`;
                            yield checkDeploy(name, namespace);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let namespace = core.getInput('namespace');
        if (!namespace) {
            core.setFailed('No namespace supplied');
        }
        let manifestsInput = core.getInput('manifests');
        if (!manifestsInput) {
            core.setFailed('No manifests supplied');
        }
        const image = core.getInput('image');
        if (!image) {
            core.setFailed('No image supplied');
        }
        const tag = core.getInput('tag');
        if (!tag) {
            core.setFailed('No tag supplied');
        }
        console.log(`KUBECONFIG environment variable is set: ${process.env.KUBECONFIG}`);
        yield getKubectl();
        let manifests = manifestsInput.split('\n');
        yield kustomization(manifests, image, tag);
        let toolRunner = new toolrunner_1.ToolRunner(kubectlPath, ['apply', '-k', './', '--namespace', namespace]);
        yield toolRunner.exec();
        yield waitForReady(manifests, namespace);
        core.setOutput("url", `https://cloud.okteto.com/#/spaces/${namespace}`);
    });
}
run().catch(core.setFailed);
