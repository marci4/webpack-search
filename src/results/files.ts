import {FileReference} from "./fileReference";

export class Files {
	public readonly modules: FileReference[] = [];

	public readonly src: FileReference[] = [];

	public readonly unknown: FileReference[] = [];

	// TODO report   "angularCompilerOptions": {
	//     "skipTemplateCodegen": true
	//   }
	public readonly nonExisting: FileReference[] = [];
}
