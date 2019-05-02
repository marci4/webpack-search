/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import * as path from "path";
import {FileReference} from "../results/fileReference";
import {Files} from "../results/files";
import {LicenseInformation} from "../results/licenseInformation";
import {FolderRunner} from "../utils/folderRunner";
import {FileCollector} from "./filecollector";

export class LicenseCollector {

	public static collectLicenses(fileCollector: FileCollector): LicenseInformation[] {
		return this.collectLicensesFromModule(fileCollector.files);
	}

	private static collectLicensesFromModule(files: Files): LicenseInformation[] {
		const result: LicenseInformation[] = [];
		if (files.modules.length === 0) {
			return result;
		}
		for (const file of files.modules) {
			LicenseCollector.checkFileReference(file, file.name, result);
		}
		return result;
	}

	private static checkFileReference(file: FileReference, name: string, licenseData: LicenseInformation[]): void {
		if (!FolderRunner.checkFolder(file, name, ((currentFolder) => {
			const licensePaths = LicenseCollector.checkForAdditionalLicenses(currentFolder);
			let existingLicenseInfo: LicenseInformation = null;
			for (const licensePath of licensePaths) {
				existingLicenseInfo = licenseData.find((licenseEntry) => licenseEntry.licensePath === licensePath);
				if (existingLicenseInfo !== undefined) {
					if (!existingLicenseInfo.fileReferences.find((referencedFiles) => referencedFiles.name === file.name)) {
						existingLicenseInfo.fileReferences.push(file);
					}
				} else {
					const licenseInfo = new LicenseInformation(licensePath, file);
					licenseData.push(licenseInfo);
				}
			}
			return licensePaths.length > 0;
		}))) {
			const missingLicenseInfo = licenseData.find((licenseEntry) => licenseEntry.licensePath === null);
			if (missingLicenseInfo === undefined) {
				licenseData.push(new LicenseInformation(null, file));
			} else {
				missingLicenseInfo.fileReferences.push(file);
			}
		}
	}

	private static checkForAdditionalLicenses(searchPath: string): string[] {
		if (fs.existsSync(searchPath)) {
			if (fs.lstatSync(searchPath).isDirectory()) {
				const files = fs.readdirSync(searchPath);
				const result: string[] = [];
				for (const file of files) {
					// angular uses readme...
					if (file.toLowerCase().includes("license") || file.toLowerCase().includes("licence")) {
						const resultingPath = path.resolve(searchPath + "\\" + file);
						if (!result.includes(resultingPath)) {
							result.push(resultingPath);
						}
					}
				}
				return result;
			}
		}
		return [];
	}

}
