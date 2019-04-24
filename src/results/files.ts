import {FileReference} from "./fileReference";

export class Files {
	public readonly modules: FileReference[] = [];

	public readonly src: FileReference[] = [];

	public readonly unknown: FileReference[] = [];
}
