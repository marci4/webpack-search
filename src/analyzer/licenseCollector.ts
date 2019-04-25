import * as fs from "fs";
import * as path from "path";
import {PackageInformation} from "../results/packageInformation";
import {FileCollector} from "./filecollector";
import {Files} from "../results/files";
import {LicenseInformation} from "../results/licenseInformation";
import {FileReference} from "../results/fileReference";
import {FolderRunner} from "../utils/folderRunner";

export class LicenseCollector {

	public static collectLicenses(fileCollector: FileCollector): LicenseInformation[]{
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
		FolderRunner.checkFolder(file, name, ((currentFolder) => {
			const licenseInfo = LicenseCollector.extractLicenses(currentFolder);
			let existingLicenseInfo: LicenseInformation = null;
			if (licenseInfo !== null) {
				// tslint:disable-next-line:max-line-length
				existingLicenseInfo = licenseData.find((packageEntry) => packageEntry.name === licenseInfo.name && packageEntry.version === licenseInfo.version);
				if (existingLicenseInfo !== undefined) {
					existingLicenseInfo.files.push(file);
				} else {
					licenseInfo.files.push(file);
					licenseData.push(licenseInfo);
				}
			}
		}));
	}

	private extractLicenses(currentFolder: string): LicenseInformation {
			const additionalLicenses = LicenseCollector.checkForAdditionalLicenses(path.resolve(currentFolder));
			if (additionalLicenses.length !== 0) {
				if (existingPackageInfo !== null) {
					for (const additionalLicense of additionalLicenses) {
						if (!existingPackageInfo.additionalLicenses.includes(additionalLicense)) {
							existingPackageInfo.additionalLicenses.push(additionalLicense);
						}
					}
				} else {
					let unreferencedLicense = packageData.find((packageEntry) => packageEntry.name === "UnreferencedLicense");
					// Also collect lonely licenses with are not in the same directory as a package.json
					if (unreferencedLicense === undefined) {
						unreferencedLicense = new PackageInformation("UnreferencedLicense")
					}
					for (const additionalLicense of additionalLicenses) {
						if (packageData.UnreferencedLicense[additionalLicense] === undefined) {
							packageData.UnreferencedLicense[additionalLicense] = {files: []};
						}
						if (!packageData.UnreferencedLicense[additionalLicense].files.includes(file)) {
							packageData.UnreferencedLicense[additionalLicense].files.push(file);
						}
					}
				}
			}
	}

	private static checkForAdditionalLicenses(searchPath: string): string[] {
		if (fs.existsSync(searchPath)) {
			if (fs.lstatSync(searchPath).isDirectory()) {
				const files = fs.readdirSync(searchPath);
				const result: string[] = [];
				for (const file of files) {
					if (file.toLowerCase().includes("packageLicense") || file.toLowerCase().includes("licence")) {
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