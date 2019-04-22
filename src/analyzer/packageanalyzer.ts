import * as fs from "fs";
import * as path from "path";
import {Author} from "../results/author";
import {Files} from "../results/files";
import {Package} from "../results/package";

export class PackageAnalyzer {
	public static collectPackages(files: Files): Package[] {
		const result = [];
		result.push(this.collectPackagesFromModule(files));
		return result;
	}

	private static checkForAdditionalLicenses(searchPath: string): string[] {
		if (fs.existsSync(searchPath)) {
			if (fs.lstatSync(searchPath).isDirectory()) {
				const files = fs.readdirSync(searchPath);
				const result = [];
				for (const file of files) {
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

	private static collectPackagesFromModule(files: Files): Package[] {
		const result = [];
		if (files.modules.length === 0) {
			return;
		}
		for (const file of files.modules) {
			PackageAnalyzer.checkFileHierarchy(file, file.name, packageData);
		}
		return result;
	}

	private static extractPackageInfo(currentFolder: string): Package {
		if (fs.existsSync(currentFolder)) {
			if (fs.lstatSync(currentFolder).isDirectory()) {
				const packagePath = currentFolder + "\\package.json";
				if (fs.existsSync(packagePath)) {
					const json = JSON.parse(fs.readFileSync(packagePath, "utf8"));
					const author = Author.parse(json.author);
					return new Package(json.name, json.version, json.licenses, author, packagePath);
				}
			}
		}
		return null;
	}

// Since we only use chunk.modules here, we only get ./node_modules
	private static checkFileHierarchy(file: File, current: string, packageData) {
		if (!fs.existsSync(current) || current === "./node_modules") {
			return;
		}
		if (fs.lstatSync(current).isDirectory()) {
			const packageInfo = PackageAnalyzer.extractPackageInfo(path.resolve(current));
			let existingPackageInfo = null;
			if (packageInfo !== null) {
				existingPackageInfo = packageData[packageInfo.name];
				if (existingPackageInfo !== undefined) {
					if (PackageAnalyzer.arePackageInfosDifferent(existingPackageInfo, packageInfo)) {
						// TODO writeResult error to file
						console.error("Different packages found: ", packageInfo, existingPackageInfo);
					} else {
						existingPackageInfo.files.push(file);
					}
				} else {
					existingPackageInfo = packageInfo;
					packageInfo.files.push(file);
					packageData[packageInfo.name] = packageInfo;
				}
			}
			const additionalLicenses = PackageAnalyzer.checkForAdditionalLicenses(path.resolve(current));
			if (additionalLicenses.length !== 0) {
				if (existingPackageInfo !== null) {
					for (const additionalLicense of additionalLicenses) {
						if (!existingPackageInfo.additionalLicenses.includes(additionalLicense)) {
							existingPackageInfo.additionalLicenses.push(additionalLicense);
						}
					}
				} else {
					// Also collect lonely licenses with are not in the same directory as a package.json
					if (packageData.UnreferencedLicense === undefined) {
						packageData.UnreferencedLicense = {};
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
		// We need to go deeper
		this.checkFileHierarchy(file, path.dirname(current), packageData);
	}

	private static arePackageInfosDifferent(existingPackageInfo: Package, packageInfo: Package): boolean {
		if (existingPackageInfo.version !== packageInfo.version || existingPackageInfo.license !== packageInfo.license) {
			return true;
		}
		if (existingPackageInfo.author === undefined && packageInfo.author === undefined) {
			return false;
		}
		return existingPackageInfo.author.name !== existingPackageInfo.author.name;
	}
}
