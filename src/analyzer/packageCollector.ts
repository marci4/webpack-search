/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import * as path from "path";
import {Author} from "../results/author";
import {FileReference} from "../results/fileReference";
import {Files} from "../results/files";
import {PackageInformation} from "../results/packageInformation";
import {FolderRunner} from "../utils/folderRunner";
import {FileCollector} from "./filecollector";

export class PackageCollector {
	public static collectPackages(fileCollector: FileCollector): PackageInformation[] {
		return this.collectPackagesFromModule(fileCollector.files);
	}

	private static collectPackagesFromModule(files: Files): PackageInformation[] {
		const result: PackageInformation[] = [];
		if (files.modules.length === 0) {
			return result;
		}
		for (const file of files.modules) {
			PackageCollector.checkFileReference(file, file.name, result);
		}
		return result;
	}

	private static extractPackageInfo(currentFolder: string): PackageInformation {
		if (fs.existsSync(currentFolder)) {
			if (fs.lstatSync(currentFolder).isDirectory()) {
				const packagePath = path.join(currentFolder, "package.json");
				if (fs.existsSync(packagePath)) {
					const json = JSON.parse(fs.readFileSync(packagePath, "utf8"));
					const author = Author.parse(json.author);
					return new PackageInformation(json.name, json.version, json.license, author, packagePath);
				}
			}
		}
		return null;
	}

	private static checkFileReference(file: FileReference, name: string, packageData: PackageInformation[]): void {
		if (!FolderRunner.checkFolder(file, name, ((currentFolder) => {
			const packageInfo = PackageCollector.extractPackageInfo(currentFolder);
			let existingPackageInfo = null;
			if (packageInfo !== null) {
				if (packageInfo.name.startsWith("@angular/material/")) {
					// Angular material has some package.json without any info, so lets go deeper.
					return false;
				}
				existingPackageInfo = packageData.find((packageEntry) => packageEntry.name === packageInfo.name && packageEntry.version === packageInfo.version);
				if (existingPackageInfo !== undefined) {
					existingPackageInfo.files.push(file);
				} else {
					packageInfo.files.push(file);
					packageData.push(packageInfo);
				}
				return true;
			}
			return false;
		}))) {
			let missingPackageInfo = packageData.find((packageEntry) => packageEntry.name === null);
			if (missingPackageInfo === undefined) {
				missingPackageInfo = new PackageInformation(null, null, null, null, null);
				packageData.push(missingPackageInfo);
			}
			missingPackageInfo.files.push(file);
		}
	}
}
