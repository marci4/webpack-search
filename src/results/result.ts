import {LicenseInformation} from "./licenseInformation";
import {PackageInformation} from "./packageInformation";
import {PackageLockInformation} from "./packageLockInformation";

export class Result {
	public errors: Error[] = [];

	public packages: PackageInformation[] = [];

	public licenses: LicenseInformation[] = [];

	public packageLocks: PackageLockInformation[] = [];
}
