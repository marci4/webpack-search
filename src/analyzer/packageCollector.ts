import * as fs from "fs";
import * as path from "path";
import {Author} from "../results/author";
import {FileReference} from "../results/fileReference";
import {Files} from "../results/files";
import {PackageInformation} from "../results/packageInformation";
import {FileCollector} from "./filecollector";
import {FolderRunner} from "../utils/folderRunner";

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
				const packagePath = currentFolder + "\\package.json";
				if (fs.existsSync(packagePath)) {
					const json = JSON.parse(fs.readFileSync(packagePath, "utf8"));
					const author = Author.parse(json.packageAuthor);
					return new PackageInformation(json.name, json.version, json.licenses, author, packagePath);
				}
			}
		}
		return null;
	}

	private static checkFileReference(file: FileReference, name: string, packageData: PackageInformation[]): void {
		FolderRunner.checkFolder(file, name, ((currentFolder) => {
			const packageInfo = PackageCollector.extractPackageInfo(currentFolder);
			let existingPackageInfo = null;
			if (packageInfo !== null) {
				// tslint:disable-next-line:max-line-length
				existingPackageInfo = packageData.find((packageEntry) => packageEntry.name === packageInfo.name && packageEntry.version === packageInfo.version);
				if (existingPackageInfo !== undefined) {
					existingPackageInfo.files.push(file);
				} else {
					packageInfo.files.push(file);
					packageData.push(packageInfo);
				}
			}
		}));
	}
}
