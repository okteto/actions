import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';

import * as toolCache from '@actions/tool-cache';

export const stableKubectlVersion = 'v1.15.0';
const kubectlToolName = 'kubectl';
const stableVersionUrl = `https://storage.googleapis.com/kubernetes-release/release/${stableKubectlVersion}/bin/linux/amd64/kubectl`;


export async function downloadKubectl(): Promise<string> {
    let cachedToolpath = toolCache.find(kubectlToolName, stableKubectlVersion);
    let kubectlDownloadPath = '';
    if (!cachedToolpath) {
        try {
            kubectlDownloadPath = await toolCache.downloadTool(stableVersionUrl);
        } catch (exception) {
            throw new Error('DownloadKubectlFailed');
        }

        cachedToolpath = await toolCache.cacheFile(kubectlDownloadPath, kubectlToolName, kubectlToolName, stableKubectlVersion);
    }

    const kubectlPath = path.join(cachedToolpath, kubectlToolName);
    fs.chmodSync(kubectlPath, '777');
    return kubectlPath;
}