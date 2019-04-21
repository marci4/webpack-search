#!/usr/bin/env node

// documentation https://webpack.js.org/api/stats/
var argv = require('yargs')
	.usage('Usage: webpack-search <working directory> <stats.json>')
	.demandOption("workingDirectory", 'Please specify the <working directory>.')
	.demandOption("stats", 'Please specify a <stats.json> file.')
	.demandOption("output", 'Please specify a <output> file.')
	.normalize()
	.help('h')
	.alias('h', 'help')
	.argv;

const fs = require('fs');
const path = require('path');
const workingDirectory = argv.workingDirectory;

// Ensure that a valid working directory is set
if (!fs.existsSync(workingDirectory)){
	console.log(`Invalid working directory: ${workingDirectory}\n`);
	process.exit(1);
}
// Update the working directory to fit for the specific stats.json
process.chdir(workingDirectory);


var file = argv.stats;
// Parse the stats.json file
var json;
try {
	json = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
	console.log(`Invalid file: ${file}\n`);
	process.exit(1);
}
// Collect all chunks and the files they reference
const chunkData = [];
json.chunks.forEach(function (chunk) {
	collectChunks(chunk, chunkData);
});
json.children.forEach(function (child) {
	child.chunks.forEach(function (chunk) {
		collectChunks(chunk, chunkData);
	});
});

// Extract all licenses from the referenced files
const returnData = {"UnknownFiles" : []};
chunkData.forEach(function (chunkData) {
	extractLicenses(chunkData.modules, returnData);
	if (chunkData.unknown.length > 0)
		returnData["UnknownFiles"].push(chunkData.unknown);
});
// Write the result to the output file
fs.writeFileSync(argv.output, JSON.stringify(returnData));

function collectChunks(chunk, data) {
	var chunkDataEntry = {"modules": [], "src": [], "unknown": []};
	chunkDataEntry.id = chunk.id;
	chunkDataEntry.rendered = chunk.rendered;
	chunkDataEntry.expectedSize = chunk.size;
	chunkDataEntry.currentSize = 0;
	hierarchy(chunk.modules, chunkDataEntry);
	data.push(chunkDataEntry);
}

function extractLicenses(files, packageData) {
	if (files.length === 0) {
		return;
	}
	files.forEach(function (file) {
		checkFileHierarchy(file, file.name, packageData);
	});
}

// Since we only use chunk.modules here, we only get ./node_modules
function checkFileHierarchy(file, current, packageData) {
	if (!fs.existsSync(current) || current === "./node_modules") {
		return;
	}
	if (fs.lstatSync(current).isDirectory()) {
		const packageInfo = checkForPackageJson(path.resolve(current));
		let existingPackageInfo = null;
		if (packageInfo !== null) {
			existingPackageInfo = packageData[packageInfo.name];
			if (existingPackageInfo !== undefined) {
				if (arePackageInfosDifferent(existingPackageInfo, packageInfo)) {
					// TODO writeResult error to file
					console.error("Different packages found: ", packageInfo, existingPackageInfo)
				} else {
					existingPackageInfo.files.push(file);
				}
			} else {
				existingPackageInfo = packageInfo;
				packageInfo.additionalLicenses = [];
				packageInfo.files = [];
				packageInfo.files.push(file);
				packageData[packageInfo.name] = packageInfo;
			}
		}
		const additionalLicenses = checkForAdditionalLicenses(path.resolve(current));
		if (additionalLicenses.length !== 0) {
			if (existingPackageInfo !== null) {
				additionalLicenses.forEach(function (additionalLicense) {
					if (!existingPackageInfo.additionalLicenses.includes(additionalLicense)) {
						existingPackageInfo.additionalLicenses.push(additionalLicense);
					}
				});
			} else {
				// Also collect lonely licenses with are not in the same directory as a package.json
				if (packageData["UnreferencedLicense"] === undefined)
					packageData["UnreferencedLicense"] = {};
				additionalLicenses.forEach(function (additionalLicense) {
					if (packageData["UnreferencedLicense"][additionalLicense] === undefined)
						packageData["UnreferencedLicense"][additionalLicense] = {"files": []};
					if (!packageData["UnreferencedLicense"][additionalLicense]["files"].includes(file)) {
						packageData["UnreferencedLicense"][additionalLicense]["files"].push(file);
					}
				});
			}
		}
	}
	// We need to go deeper
	checkFileHierarchy(file, path.dirname(current), packageData);
}

function arePackageInfosDifferent(existingPackageInfo, packageInfo) {
	if (existingPackageInfo.version !== packageInfo.version || existingPackageInfo.licenses !== packageInfo.licenses)
		return true;
	if (existingPackageInfo.author === undefined && packageInfo.author === undefined)
		return false;
	if (existingPackageInfo.author.name !== existingPackageInfo.author.name)
		return true;
	return false;
}

function checkForAdditionalLicenses(searchPath) {
	if (fs.existsSync(searchPath)) {
		if (fs.lstatSync(searchPath).isDirectory()) {
			files = fs.readdirSync(searchPath);
			var result = [];
			files.forEach(function (file) {
				if (file.toLowerCase().includes("licenses") || file.toLowerCase().includes("licence")) {
					const resultingPath = path.resolve(searchPath + "\\" + file);
					if (!result.includes(resultingPath)) {
						result.push(resultingPath);
					}
				}
			});
			return result;
		}
	}
	return [];
}

function checkForPackageJson(path) {
	if (fs.existsSync(path)) {
		if (fs.lstatSync(path).isDirectory()) {
			const packagePath = path + '\\package.json';
			if (fs.existsSync(packagePath)) {
				json = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
				return {
					"name": json.name,
					"version": json.version,
					"license": json.licenses,
					"author": json.author,
					"packageJson": packagePath
				};
			}
		}
	}
	return null;
}

function hierarchy(modules, data) {
	if (modules.length === 0) {
		return;
	}
	modules.forEach(function (module) {
			if (module.modules) {
				return hierarchy(module.modules, data);
			}
			let name = module.name;
			if (name.startsWith("./node_modules/")) {
				data.modules.push({"name": name, "built": module.built});
			} else if (name.startsWith("./src/")) {
				data.src.push({"name": name, "built": module.built});
			} else {
				data.unknown.push({"name": name, "built": module.built});
			}
			data.currentSize += module.size;
		}
	)
}