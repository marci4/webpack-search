import * as fs from "fs";
import * as path from "path";
import * as request from "request";
import {Configuration} from "../configuration/configuration";
import {Result} from "../results/result";

export class PackageLockExport {

	public static exportReferencedPackages(configuration: Configuration, result: Result): void {
		const directory = configuration.packageOutput;
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory);
		} else {
			const files = fs.readdirSync(directory);
			for (const file of files) {
				fs.unlinkSync(path.join(directory, file));
			}
		}
		for (const packageReference of result.packages) {
			if (packageReference.name === null && packageReference.version === null) {
				continue;
			}
			const packageLockInfo = result.packageLocks.find((packageLockEntry) => {
				return packageReference.name === packageLockEntry.name && packageReference.version === packageLockEntry.version;
			});
			if (packageLockInfo === undefined) {
				//
				result.errors.push(new Error("Could not find the referenced package in the package-lock.json. Name: " + packageReference.name + " Version: " + packageReference.version));
			} else {
				//
				this.downloadFile(packageLockInfo.resolvedPath, path.join(directory, path.basename(packageLockInfo.resolvedPath)), (error) => {
					if (error !== null) {
						result.errors.push(error);
					}
				});
			}
		}
	}

	private static downloadFile(url: string, dest: string, callback: (error: Error) => void): void {
		const file = fs.createWriteStream(dest);
		const sendReq = request.get(url);

		// verify response code
		sendReq.on("response", (response) => {
			if (response.statusCode !== 200) {
				return callback(new Error("Response status was " + response.statusCode));
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
