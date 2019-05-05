/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import * as path from "path";
import * as request from "request";
import {Configuration} from "../configuration/configuration";
import {ErrorMessage} from "../results/errorMessage";
import {Result} from "../results/result";

export namespace PackageLockExport {

	export function exportReferencedPackages(config: Configuration, result: Result): void {
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
				//
				this.downloadFile(packageLockInfo.resolvedPath, path.join(directory, path.basename(packageLockInfo.resolvedPath)), (error: ErrorMessage) => {
					if (error !== null) {
						result.errors.push(error);
					}
				});
			}
		}
	}

	export function downloadFile(url: string, dest: string, callback: (error: ErrorMessage) => void): void {
		const file = fs.createWriteStream(dest);
		const sendReq = request.get(url);

		// verify response code
		sendReq.on("response", (response) => {
			if (response.statusCode !== 200) {
				return callback(new ErrorMessage("Response status was " + response.statusCode));
			}

			sendReq.pipe(file);
		});

		// close() is async, call cb after close completes
		file.on("finish", () => file.close());

		// check for request errors
		sendReq.on("error", (err) => {
			fs.unlink(dest, () => {
				// Ignore
			});
			callback(err);
		});

		file.on("error", (err) => { // Handle errors
			fs.unlink(dest, () => {
				// Ignore
			});
			callback(err);
		});
	}
}
