export class ASN1TooDeepError extends Error {
	constructor() {
		super("ASN.1 data exceeds maximum depth");
	}
}

export class ASN1InvalidError extends Error {
	constructor() {
		super("Invalid ASN.1 data");
	}
}

export class ASN1LeftoverBytesError extends Error {
	constructor(count: number) {
		super(`ASN.1 leftover bytes: ${count}`);
	}
}
