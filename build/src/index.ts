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
        let toolRunner = new ToolRunner('/bin/chmod', ['+x', oktetoPath]);
        await toolRunner.exec();
    }

    return oktetoPath;
}


async function run(){
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

    const oktetoPath = await setOkteto();
    console.log(`okteto available at: ${oktetoPath}`);
    
    let toolRunner = new ToolRunner('okteto', ['build', '-f', file, '-t', tag, buildPath]);
    await toolRunner.exec();
}

run().catch(core.setFailed);