"use strict";

import * as fs from 'fs';
import * as yaml from 'js-yaml';

import * as core from '@actions/core';
import { ToolRunner } from "@actions/exec/lib/toolrunner";
import * as toolCache from '@actions/tool-cache';
import { downloadKubectl, stableKubectlVersion } from "./kubectl";

let kubectlPath = "";

async function getKubectl() {
    kubectlPath = toolCache.find('kubectl', stableKubectlVersion);
    if (!kubectlPath) {
        kubectlPath = await downloadKubectl()
    }
}

async function checkDeploy(name: string, namespace: string) {
    const toolrunner = new ToolRunner(kubectlPath, ['rollout', 'status', name, `--namespace`, namespace]);
    return toolrunner.exec();
}

async function run(){
    let namespace = core.getInput('namespace');
    if (!namespace) {
        core.setFailed('No namespace supplied');
    }

    let manifestsInput = core.getInput('manifests');
    if (!manifestsInput) {
        core.setFailed('No manifests supplied');
    }

    console.log(`KUBECONFIG environment variable is set: ${process.env.KUBECONFIG}`);
    await getKubectl();
    let manifests = manifestsInput.split('\n');
    
    for (var i = 0; i < manifests.length; i++) {
        let toolRunner = new ToolRunner(kubectlPath, ['apply', '-f', manifests[i], '--namespace', namespace]);
        await toolRunner.exec();
    }

    for (var i = 0; i < manifests.length; i++) {
        let content = fs.readFileSync(manifests[i]).toString();
        yaml.safeLoadAll(content, async function (m: any) {
            if (!!m.kind && !!m.metadata && !!m.metadata.name) {
                let kind: string = m.kind;
                switch (kind.toLowerCase()) {
                    case 'deployment':
                    case 'daemonset':
                    case 'statefulset':
                      const name = `${kind.trim()}/${m.metadata.name.trim()}`
                      await checkDeploy(name, namespace);
                      return;
                    default:
                        return;
                }
            }
        });
    }

    core.setOutput("url", `https://cloud.okteto.com/#/spaces/${namespace}`);
}

run().catch(core.setFailed);