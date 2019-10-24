"use strict";

const core = require('@actions/core');
import * as toolCache from '@actions/tool-cache';
import { downloadOkteto, version } from "./okteto";
import { ToolRunner } from "@actions/exec/lib/toolrunner";

async function setOkteto() {
    let oktetoPath = toolCache.find('okteto', version);
    if (!oktetoPath) {
        oktetoPath = await downloadOkteto()
    }

    return oktetoPath;
}

async function setNamespace(path: string, namespace: string, token: string){
    let toolRunner = new ToolRunner(path, ['namespace', namespace], {
        env: {
            "OKTETO_TOKEN": token
        }
    });
    await toolRunner.exec();
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

    const path = await setOkteto();
    await setNamespace(path, namespace, token);
}

run().catch(core.setFailed);