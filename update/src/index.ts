"use strict";

import * as fs from 'fs';
import * as core from '@actions/core';

function update(manifests: string[], image: string, tag: string) {
  manifests.forEach((filePath: string) => {
    let fileContent = fs.readFileSync(filePath).toString();
    if (fileContent.indexOf(image) > 0) {
      const updatedFileContent = substituteImageName(fileContent, image, tag);
      if (updatedFileContent) {
        fs.writeFileSync(filePath, updatedFileContent);
        console.log(`updated ${filePath}`);
      }
    }
  });
}

function substituteImageName(fileContent: string, image: string, tag: string): string | undefined {
  if (fileContent.indexOf(image) < 0) {
      return undefined;
  }

  return fileContent.split('\n').reduce((acc, line) => {
      const imageKeyword = line.match(/^.*image:/);
      if (imageKeyword) {
          const [currentImageName, currentImageTag] = line
              .substring(imageKeyword[0].length) // consume the line from keyword onwards
              .trim()
              .replace(/[',"]/g, '') // replace allowed quotes with nothing
              .split(':');

          if (currentImageName === image) {
              const newline = `${imageKeyword[0]} ${image}:${tag}\n`;
              return acc + newline;
          }
      }

      return acc + line + '\n';
  }, '');
}

async function run(){
    let manifestsInput = core.getInput('manifests');
    if (!manifestsInput) {
        return;
    }

    const image = core.getInput('image');
    if (!image) {
      core.setFailed('No image supplied');
    }

    const tag = core.getInput('tag');
    if (!tag) {
      core.setFailed('No tag supplied');
    }

    let manifests = manifestsInput.split('\n');
    update(manifests, image, tag);
    
}

run().catch(core.setFailed);