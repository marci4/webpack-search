/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import * as got from "got";
import * as path from "path";
import {Configuration} from "../configuration/configuration";
import {ErrorMessage} from "../results/errorMessage";
import {Result} from "../results/result";

export namespace PackageLockExport {

	export async function exportReferencedPackages(config: Configuration, result: Result): Promise<void> {
		const directory = config.packageOutput;
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory);
		} else {
			const files = fs.readdirSync(directory);
			for (const file of files) {
				fs.unlinkSync(path.join(directory, file));
			}
		}
		for (const packageReference of result.packages) {
			if (packageReference.name === null || packageReference.version === null) {
				result.errors.push(new ErrorMessage("Referenced package is null. Name: " + packageReference.name + " Version: " + packageReference.version));
				continue;
			}
			const packageLockInfo = result.packageLocks.find((packageLockEntry) => {
				return packageReference.name === packageLockEntry.name && packageReference.version === packageLockEntry.version;
			});
			if (packageLockInfo === undefined) {
				result.errors.push(new ErrorMessage("Could not find the referenced package in the package-lock.json. Name: " + packageReference.name + " Version: " + packageReference.version));
				continue;
			} else {
				try {
					await PackageLockExport.downloadFile(packageLockInfo.resolvedPath, path.join(directory, path.basename(packageLockInfo.resolvedPath)));
				} catch (error) {
					result.errors.push(error);
				}
			}
		}
		return Promise.resolve();
	}

	export async function downloadFile(url: string, dest: string): Promise<void> {
		try {
			const response = await got.get(url);
			fs.writeFileSync(dest, response.body);
			return Promise.resolve();
		} catch (error) {
			try {
				fs.unlinkSync(dest);
			} catch (e) {
				// Ignore
			}
			return Promise.reject(new ErrorMessage(error.toString()));
		}
	}
}
