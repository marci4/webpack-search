#!/usr/bin/env node

// documentation https://webpack.js.org/api/stats/
var argv = require('yargs')
	.usage('Usage: webpack-stats-duplicates <stats.json>')
	.demand(1, 'Please specify a <stats.json> file.')
	.normalize()
	.option('c', {
		describe: 'Specify the location of the .wsdrc file',
		alias: 'config',
		normalize: true
	})
	.option('d', {
		describe: 'Do not use the .wsdrc file',
		alias: 'disable-config',
		boolean: true
	})
	.option('w', {
		describe: 'Comma separated list of whitelisted module paths',
		alias: 'whitelist',
		string: true
	})
	.help('h')
	.alias('h', 'help')
	.argv;

var fs = require('fs');
var loadConfig = require('./lib/loadConfig');
var findDuplicates = require('./lib/findDuplicates');
var printDuplicates = require('./lib/printDuplicates');
var file = argv._[0];

// Parse the stats.json file
var json;
try {
	json = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
	console.log(`Invalid file: ${file}\n`);
	process.exit(1);
}

var options = {};

// --disable-config option
if (!argv.disableConfig) {
	// --config option
	loadConfig(argv.config, function (err, opts) {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		options = opts;
	});
}

// --whitelist option
if (argv.whitelist) {
	options.whitelist = argv.whitelist.split(',');
}
var data = [];
data.modules = [];
data.src = [];
data.unknown = [];
json.chunks.forEach(function (chunk) {
	hierarchy(chunk.modules, data)
})
console.log(data);

function hierarchy(modules, data) {
	if (modules.length === 0) {
		return;
	}
	modules.forEach(function (module) {
			if (module.modules) {
				return hierarchy(module.modules, data);
			}
			const name = module.name;
			if (name.startsWith("./node_modules/")) {
				data.modules.push({"name": module.name, "built": module.built});
			} else if (name.startsWith("./src/")) {
				data.src.push({"name": module.name, "built": module.built});
			} else {
				data.unknown.push({"name": module.name, "built": module.built});
			}
		}
	)
}