/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {AssetReference} from "../results/assetReference";
import {FileReference} from "../results/fileReference";
import {Files} from "../results/files";
import {Reason} from "../results/reason";
export class FileCollector {

	private static collectReasons(reasons: any[]): Reason[] {
		if (reasons === undefined || (!(reasons instanceof Array))) {
			return [];
		}
		const result = [];
		for (const reason of reasons) {
			result.push(new Reason(reason.moduleName, reason.moduleIdentifier, reason.type));
		}
		return result;
	}

	private static collectAssets(assets: any[]): AssetReference[] {
		if (assets === undefined || (!(assets instanceof Array))) {
			return [];
		}
		const result = [];
		for (const asset of assets) {
			// TODO Maybe include some more info
			result.push(new AssetReference(asset.name, asset.emitted, asset.size));
		}
		return result;
	}

	public readonly files = new Files();

	constructor(json: any) {
		this.collectFiles(json);
	}

	public filesFound(): boolean {
		return this.files.modules.length > 0 || this.files.src.length > 0 || this.files.unknown.length > 0;
	}

	private collectFiles(json: any): void {
		this.collectChunks(json.chunks);
		if (json.children !== undefined && (json.children instanceof Array)) {
			for (const child of json.children) {
				this.collectFiles(child);
			}
		}
		this.collectModules(json.modules);
	}

	private collectChunks(chunks: any[]): boolean {
		if (chunks === undefined || (!(chunks instanceof Array))) {
			return false;
		}
		for (const chunk of chunks) {
			this.collectModules(chunk.modules);
		}
		return true;
	}

	private collectModules(modules: any[]): boolean {
		if (modules === undefined || (!(modules instanceof Array))) {
			return false;
		}
		for (const module of modules) {
			const fileReference = new FileReference(module.name, module.built);
			fileReference.assets = FileCollector.collectAssets(module.assets);
			fileReference.reasons = FileCollector.collectReasons(module.reasons);
			this.collectModules(module.modules);
			this.addFileReferencetoFiles(fileReference);
		}
		return false;
	}

	private addFileReferencetoFiles(fileReference: FileReference) {
		if (fileReference.reasons.length === 1) {
			if (fileReference.reasons[0].type === "multi entry") {
				let fileReferenceName = fileReference.name;
				if (fileReferenceName.startsWith("multi ")) {
					fileReferenceName = fileReferenceName.substr("multi ".length);
				}
				for (const subName of fileReferenceName.split(" ")) {
					const subFileReference = new FileReference(subName, fileReference.built);
					subFileReference.assets = fileReference.assets;
					// Do NOT include the reasons...
					this.addFileReferencetoFiles(subFileReference);
				}
				return;
			}
		}
		if (fileReference.name.startsWith("./node_modules/")) {
			if (this.files.modules.find((fileEntry) => {
				return fileEntry.name === fileReference.name;
			}) === undefined) {
				this.files.modules.push(fileReference);
			}
		} else if (fileReference.name.startsWith("./src/")) {
			if (this.files.src.find((fileEntry) => {
				return fileEntry.name === fileReference.name;
			}) === undefined) {
				this.files.src.push(fileReference);
			}
		} else {
			// TODO Better handle multi & css
			this.files.unknown.push(fileReference);
		}
	}
}
