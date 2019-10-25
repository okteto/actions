import * as path from 'path';
import * as fs from 'fs';
import * as toolCache from '@actions/tool-cache';
import fetch from 'cross-fetch';

const toolName = 'okteto';
export const version = '1.5.1';
const stableVersionUrl = `https://github.com/okteto/okteto/releases/download/${version}/okteto-Linux-arm64`;

export async function downloadOkteto(): Promise<string> {
    let cachedToolpath = toolCache.find(toolName, version);
    let downloadPath = '';
    if (!cachedToolpath) {
        try {
            console.log(`downloading ${stableVersionUrl}`);
            const response = await fetch(stableVersionUrl, {method: "head"} );
            console.log(`response ${response.status}`);
            let realURL = response.headers.get('Location');
            if (!realURL) {
                console.log(`response didn't include a redirect`);
                realURL = stableVersionUrl;
            }
            
            console.log(`really downloading ${realURL}`);
            downloadPath = await toolCache.downloadTool(realURL);
        } catch (exception) {
            throw new Error('DownloadKubectlFailed');
        }

        cachedToolpath = await toolCache.cacheFile(downloadPath, toolName, toolName, version);
    }

    const oktetoPath = path.join(cachedToolpath, toolName);
    fs.chmodSync(oktetoPath, '777');
    return oktetoPath;
}