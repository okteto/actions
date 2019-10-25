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
const core = require("@actions/core");
function update(manifests, image, tag) {
    manifests.forEach((filePath) => {
        let fileContent = fs.readFileSync(filePath).toString();
        if (fileContent.indexOf(image) > 0) {
            const updatedFileContent = substituteImageName(fileContent, image, tag);
            if (updatedFileContent) {
                fs.writeFileSync(filePath, fileContent);
                console.log(`updated ${filePath}`);
            }
        }
    });
}
function substituteImageName(fileContent, image, tag) {
    if (fileContent.indexOf(image) < 0) {
        return undefined;
    }
    const fullImage = `${image}:${tag}`;
    return fileContent.split('\n').reduce((acc, line) => {
        console.log(line);
        const imageKeyword = line.match(/^ *image:/);
        if (imageKeyword) {
            console.log(`it's a match: ${imageKeyword}`);
            const [currentImageName, currentImageTag] = line
                .substring(imageKeyword[0].length) // consume the line from keyword onwards
                .trim()
                .replace(/[',"]/g, '') // replace allowed quotes with nothing
                .split(':');
            console.log(`currentImageName: ${currentImageName}`);
            if (currentImageName === image) {
                return acc + `${imageKeyword[0]} ${fullImage}\n`;
            }
        }
        return acc + line + '\n';
    }, '');
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
run().catch(core.setFailed);
