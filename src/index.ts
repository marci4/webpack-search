import {main} from "./main";

main(process.argv).catch((message) => {
	console.error(message);
	process.exit(1);
});
