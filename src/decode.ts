import {
	ASN1BitString,
	ASN1Boolean,
	ASN1Class,
	ASN1EncodingType,
	ASN1Enumerated,
	ASN1Integer,
	ASN1RealZero,
	ASN1SpecialReal,
	ASN1RealDecimalEncoding,
	RealBinaryEncodingBase,
	SpecialReal,
	RealDecimalEncodingFormat,
	ASN1RealBinaryEncoding,
	ASN1OctetString,
	ASN1Null,
	ASN1ObjectIdentifier,
	ASN1Sequence,
	ASN1Set,
	ASN1UTF8String,
	ASN1NumericString,
	ASN1PrintableString,
	ASN1IA5String,
	ANS1GeneralizedTime,
	ASN1EncodedValue,
	ANS1UTCTime,
	ASN1_UNIVERSAL_TAG
} from "./asn1.js";
import { toVariableInt, toVariableLengthQuantityBigEndian, toVariableUint } from "./integer.js";
import { decodeASCII } from "./string.js";

import type { ASN1Value } from "./asn1.js";

export function decodeASN1NoLeftoverBytes(data: Uint8Array, maxDepth: number): ASN1Value {
	const [decoded, size] = decodeASN1IntoKnownValues(data, maxDepth, 0);
	if (data.byteLength !== size) {
		throw new ASN1LeftoverBytesError(data.byteLength - size);
	}
	return decoded;
}

export function decodeASN1(data: Uint8Array, maxDepth: number): [result: ASN1Value, size: number] {
	return decodeASN1IntoKnownValues(data, maxDepth, 0);
}

function decodeASN1IntoKnownValues(
	data: Uint8Array,
	maxDepth: number,
	currentDepth: number
): [result: ASN1Value, size: number] {
	if (currentDepth > maxDepth) {
		throw new ASN1TooDeepError();
	}

	const [decoded, size] = parseASN1(data);

	if (decoded.class !== ASN1Class.Universal) {
		return [decoded, size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.BOOLEAN) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		if (decoded.contents.byteLength !== 1) {
			throw new ASN1InvalidError();
		}
		if (decoded.contents[0] === 0x00) {
			return [new ASN1Boolean(false), size];
		}
		if (decoded.contents[0] === 0xff) {
			return [new ASN1Boolean(true), size];
		}
		throw new ASN1InvalidError();
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.INTEGER) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		if (decoded.contents.byteLength < 1) {
			throw new ASN1InvalidError();
		}
		return [new ASN1Integer(toVariableInt(decoded.contents)), size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.BIT_STRING) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		if (decoded.contents.byteLength < 1) {
			throw new ASN1InvalidError();
		}
		const unusedBits = decoded.contents[0];
		if (unusedBits > 7) {
			throw new ASN1InvalidError();
		}
		const value = decoded.contents.slice(1);
		if (unusedBits > 0 && value.byteLength === 0) {
			throw new ASN1InvalidError();
		}
		return [new ASN1BitString(value, value.byteLength * 8 - unusedBits), size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.OCTET_STRING) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		return [new ASN1OctetString(decoded.contents), size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.NULL) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		if (decoded.contents.byteLength > 0) {
			throw new ASN1InvalidError();
		}
		return [new ASN1Null(), size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.OBJECT_IDENTIFIER) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		if (decoded.contents.byteLength < 1) {
			throw new ASN1InvalidError();
		}
		return [new ASN1ObjectIdentifier(decoded.contents), size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.ENUMERATED) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		if (decoded.contents.byteLength < 1) {
			throw new ASN1InvalidError();
		}
		return [new ASN1Enumerated(toVariableInt(decoded.contents)), size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.REAL) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		if (decoded.contents.length === 0) {
			return [new ASN1RealZero(), size];
		}
		if (decoded.contents[0] >> 7 === 1) {
			// Binary
			let base: RealBinaryEncodingBase;
			if (((decoded.contents[0] >> 4) & 0x03) === 0x00) {
				base = RealBinaryEncodingBase.Base2;
			} else if (((decoded.contents[0] >> 4) & 0x03) === 0x01) {
				base = RealBinaryEncodingBase.Base8;
			} else if (((decoded.contents[0] >> 4) & 0x03) === 0x02) {
				base = RealBinaryEncodingBase.Base16;
			} else {
				throw new ASN1InvalidError();
			}
			const scalingFactor = (decoded.contents[0] >> 2) & 0x03;
			let exponent: bigint;
			let encodedExponentSize: number;
			if ((decoded.contents[0] & 0x03) === 0x00) {
				if (decoded.contents.byteLength < 2) {
					throw new ASN1InvalidError();
				}
				exponent = toVariableInt(decoded.contents.slice(1, 2));
				encodedExponentSize = 1;
			} else if ((decoded.contents[0] & 0x03) === 0x01) {
				if (decoded.contents.byteLength < 3) {
					throw new ASN1InvalidError();
				}
				exponent = toVariableInt(decoded.contents.slice(1, 3));
				encodedExponentSize = 2;
			} else if ((decoded.contents[0] & 0x03) === 0x02) {
				if (decoded.contents.byteLength < 4) {
					throw new ASN1InvalidError();
				}
				exponent = toVariableInt(decoded.contents.slice(1, 4));
				encodedExponentSize = 3;
			} else if ((decoded.contents[0] & 0x03) === 0x03) {
				if (decoded.contents.byteLength < 2) {
					throw new ASN1InvalidError();
				}
				const exponentSize = decoded.contents[1];
				// in DER, it should really be at least 4
				if (exponentSize < 1) {
					throw new ASN1InvalidError();
				}
				if (decoded.contents.byteLength < 2 + exponentSize) {
					throw new ASN1InvalidError();
				}
				exponent = toVariableInt(decoded.contents.slice(2, 2 + exponentSize));
				encodedExponentSize = 1 + exponentSize;
			} else {
				// unreachable
				throw new ASN1InvalidError();
			}
			if (decoded.contents.byteLength === 1 + encodedExponentSize) {
				throw new ASN1InvalidError();
			}
			const N = toVariableUint(decoded.contents.slice(1 + encodedExponentSize));
			let mantissa = N * BigInt(2 ** scalingFactor);
			if (((decoded.contents[0] >> 6) & 0x01) === 0x01) {
				mantissa = mantissa * -1n;
			}
			return [new ASN1RealBinaryEncoding(mantissa, base, exponent), size];
		}
		if (decoded.contents[0] == 0x01) {
			return [
				new ASN1RealDecimalEncoding(
					RealDecimalEncodingFormat.ISO6093NR1,
					decoded.contents.slice(1)
				),
				size
			];
		}
		if (decoded.contents[0] == 0x02) {
			return [
				new ASN1RealDecimalEncoding(
					RealDecimalEncodingFormat.ISO6093NR2,
					decoded.contents.slice(1)
				),
				size
			];
		}
		if (decoded.contents[0] == 0x03) {
			return [
				new ASN1RealDecimalEncoding(
					RealDecimalEncodingFormat.ISO6093NR3,
					decoded.contents.slice(1)
				),
				size
			];
		}
		if (decoded.contents[0] === 0x40) {
			return [new ASN1SpecialReal(SpecialReal.PlusInfinity), size];
		}
		if (decoded.contents[0] === 0x41) {
			return [new ASN1SpecialReal(SpecialReal.MinusInfinity), size];
		}
		// unreachable
		throw new ASN1InvalidError();
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.SEQUENCE) {
		if (decoded.type !== ASN1EncodingType.Constructed) {
			throw new ASN1InvalidError();
		}
		const value: ASN1Value[] = [];
		let readBytes = 0;
		while (readBytes !== decoded.contents.byteLength) {
			const [decodedSequenceItem, sequenceItemSize] = decodeASN1IntoKnownValues(
				decoded.contents.slice(readBytes),
				maxDepth,
				currentDepth + 1
			);
			value.push(decodedSequenceItem);
			readBytes += sequenceItemSize;
		}
		return [new ASN1Sequence(value), size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.SET) {
		if (decoded.type !== ASN1EncodingType.Constructed) {
			throw new ASN1InvalidError();
		}
		const value: ASN1Value[] = [];
		let readBytes = 0;
		while (readBytes !== decoded.contents.byteLength) {
			const [decodedSequenceItem, sequenceItemSize] = decodeASN1IntoKnownValues(
				decoded.contents.slice(readBytes),
				maxDepth,
				currentDepth + 1
			);
			value.push(decodedSequenceItem);
			readBytes += sequenceItemSize;
		}
		return [new ASN1Set(value), size];
	}
	if (decoded.tag === ASN1_UNIVERSAL_TAG.UTF8_STRING) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		return [new ASN1UTF8String(decoded.contents), size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.NUMERIC_STRING) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		return [new ASN1NumericString(decoded.contents), size];
	}
	if (decoded.tag === ASN1_UNIVERSAL_TAG.PRINTABLE_STRING) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		return [new ASN1PrintableString(decoded.contents), size];
	}
	if (decoded.tag === ASN1_UNIVERSAL_TAG.IA5_STRING) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		return [new ASN1IA5String(decoded.contents), size];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.GENERALIZED_TIME) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		let decodedString = decodeASCII(decoded.contents);
		if (!decodedString.endsWith("Z")) {
			throw new ASN1InvalidError();
		}
		decodedString = decodedString.replace("Z", "");
		let wholePart: string;
		let decimalPart: string | null = null;
		if (decodedString.includes(".")) {
			[wholePart, decimalPart] = decodedString.split(".");
		} else {
			wholePart = decodedString;
		}
		if (wholePart.length !== 14) {
			throw new ASN1InvalidError();
		}
		let milliseconds = 0;
		if (decimalPart !== null) {
			if (decimalPart.length > 3) {
				throw new ASN1InvalidError();
			}
			milliseconds = Number(decimalPart.padEnd(3, "0"));
		}
		return [
			new ANS1GeneralizedTime(
				Number(wholePart.slice(0, 4)),
				Number(wholePart.slice(4, 6)),
				Number(wholePart.slice(6, 8)),
				Number(wholePart.slice(8, 10)),
				Number(wholePart.slice(10, 12)),
				Number(wholePart.slice(12, 14)),
				milliseconds
			),
			size
		];
	}

	if (decoded.tag === ASN1_UNIVERSAL_TAG.UTC_TIME) {
		if (decoded.type !== ASN1EncodingType.Primitive) {
			throw new ASN1InvalidError();
		}
		let decodedString = decodeASCII(decoded.contents);
		if (decodedString.length !== 13 || !decodedString.endsWith("Z")) {
			throw new ASN1InvalidError();
		}
		decodedString = decodedString.replace("Z", "");
		return [
			new ANS1UTCTime(
				Number(decodedString.slice(0, 2)),
				Number(decodedString.slice(2, 4)),
				Number(decodedString.slice(4, 6)),
				Number(decodedString.slice(6, 8)),
				Number(decodedString.slice(8, 10)),
				Number(decodedString.slice(10, 12))
			),
			size
		];
	}

	throw new ASN1InvalidError();
}

function parseASN1(data: Uint8Array): [result: ASN1EncodedValue, size: number] {
	if (data.byteLength < 2) {
		throw new ASN1InvalidError();
	}

	let asn1Class: ASN1Class;
	if (data[0] >> 6 === 0b00) {
		asn1Class = ASN1Class.Universal;
	} else if (data[0] >> 6 === 0b01) {
		asn1Class = ASN1Class.Application;
	} else if (data[0] >> 6 === 0b10) {
		asn1Class = ASN1Class.ContextSpecific;
	} else if (data[0] >> 6 === 0b11) {
		asn1Class = ASN1Class.Private;
	} else {
		// unreachable
		throw new ASN1InvalidError();
	}

	let encodingType: ASN1EncodingType;
	if (((data[0] >> 5) & 0x01) === 0) {
		encodingType = ASN1EncodingType.Primitive;
	} else if (((data[0] >> 5) & 0x01) === 1) {
		encodingType = ASN1EncodingType.Constructed;
	} else {
		// unreachable
		throw new ASN1InvalidError();
	}

	let tag: number;
	let offset = 1;
	if ((data[0] & 0x1f) < 31) {
		tag = data[0] & 0x1f;
	} else {
		try {
			const [decodedTag, tagSize] = toVariableLengthQuantityBigEndian(data.slice(offset));
			tag = Number(decodedTag);
			offset += tagSize;
		} catch {
			throw new ASN1InvalidError();
		}
	}
	if (tag > 16384) {
		throw new ASN1InvalidError();
	}

	if (data[offset] === 0x80) {
		// indefinite form
		throw new ASN1InvalidError();
	}

	let contentLength = 0;
	if (data[offset] >> 7 === 0) {
		contentLength = data[offset] & 0x7f;
		offset++;
	} else {
		try {
			const [decodedContentLength, contentLengthSize] = toVariableLengthQuantityBigEndian(
				data.slice(offset)
			);
			contentLength = Number(decodedContentLength);
			offset += contentLengthSize;
		} catch {
			throw new ASN1InvalidError();
		}
	}
	if (data.length < offset + contentLength) {
		throw new ASN1InvalidError();
	}
	const value = data.slice(offset, offset + contentLength);
	const result = new ASN1EncodedValue(asn1Class, encodingType, tag, value);
	return [result, offset + contentLength];
}

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
