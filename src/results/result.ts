import {LicenseInformation} from "./licenseInformation";
import {PackageInformation} from "./packageInformation";

export class Result {
	public errors: Error[] = [];

	public packages: PackageInformation[] = [];

	public licenses: LicenseInformation[] = [];
}
