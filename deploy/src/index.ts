"use strict";

import {promises} from 'fs';
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

async function kustomization(manifests: string[], image: string, tag: string){
  promises.writeFile('kustomization.yaml', yaml.safeDump({
    resources: manifests,
    images: [{
      name: image,
      newName: image,
      newTag: tag
    }]})
  );
}

async function waitForReady(manifests: string[], namespace: string) {
  for (var i = 0; i < manifests.length; i++) {
    let content = await promises.readFile(manifests[i]);
    const loaded = yaml.safeLoadAll(content.toString())
    for (var j = 0; j < loaded.length; j++){
        const m = loaded[j];
        if (!!m.kind && !!m.metadata && !!m.metadata.name) {
          let kind: string = m.kind;
          switch (kind.toLowerCase()) {
            case 'deployment':
            case 'daemonset':
            case 'statefulset':
              const name = `${kind.trim()}/${m.metadata.name.trim()}`
              await checkDeploy(name, namespace);
              break;
            default:
              break;
          }
        } 
    }
  }
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

    const image = core.getInput('image');
    if (!image) {
      core.setFailed('No image supplied');
    }

    const tag = core.getInput('tag');
    if (!tag) {
      core.setFailed('No tag supplied');
    }

    console.log(`KUBECONFIG environment variable is set: ${process.env.KUBECONFIG}`);
    await getKubectl();
    
    let manifests = manifestsInput.split('\n');
    await kustomization(manifests, image, tag);
    
    let toolRunner = new ToolRunner(kubectlPath, ['apply', '-k', './', '--namespace', namespace]);
    await toolRunner.exec();
    
    await waitForReady(manifests, namespace);

    core.setOutput("url", `https://cloud.okteto.com/#/spaces/${namespace}`);
}

run().catch(core.setFailed);