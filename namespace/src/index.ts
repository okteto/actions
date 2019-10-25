"use strict";
import * as path from 'path';

import * as core from '@actions/core';
import { issueCommand } from '@actions/core/lib/command';
import * as toolCache from '@actions/tool-cache';
import { downloadOkteto, version } from "./okteto";
import { ToolRunner } from "@actions/exec/lib/toolrunner";

async function setOkteto() {
    let oktetoPath = toolCache.find('okteto', version);
    if (!oktetoPath) {
        oktetoPath = await downloadOkteto()
        await makeExecutable(oktetoPath);
    }

    return oktetoPath;
}


async function makeExecutable(oktetoPath: string){
    let toolRunner = new ToolRunner('/bin/chmod', ['+x', oktetoPath]);
    await toolRunner.exec();
}

async function setNamespace(path: string, namespace: string, token: string){
    let toolRunner = new ToolRunner(path, ['namespace', namespace], {
        env: {
            "OKTETO_TOKEN": token,
        }
    });
    await toolRunner.exec();
}

function setKubeconfig() {
    const kubeconfigPath = path.join('.', `.kube/config`);
    issueCommand('set-env', { name: 'KUBECONFIG' }, kubeconfigPath);
    console.log(`KUBECONFIG environment variable is set`);
}

async function run(){
    let token = core.getInput('token');
    if (!token) {
        core.setFailed('No token supplied');
    }
    let namespace = core.getInput('namespace');
    if (!namespace) {
        core.setFailed('No namespace supplied');
    }

    const oktetoPath = await setOkteto();
    console.log(`okteto available at: ${oktetoPath}`);
    
    await setNamespace(oktetoPath, namespace, token);
    setKubeconfig();    
}

run().catch(core.setFailed);