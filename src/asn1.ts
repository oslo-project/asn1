import { ASN1InvalidError } from "./decode.js";
import { DynamicBuffer } from "@oslojs/binary";
import {
	variableLengthQuantityBigEndian,
	variableIntToBytesBigEndian,
	variableUintToBytesBigEndian
} from "./integer.js";
import { decodeASCII } from "./string.js";
import { encodeASN1 } from "./encode.js";

export class ASN1Boolean implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.BOOLEAN;
	public value: boolean;

	constructor(value: boolean) {
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		if (this.value) {
			return new Uint8Array([0xff]);
		}
		return new Uint8Array([0x00]);
	}
}

export class ASN1Integer implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.INTEGER;
	public value: bigint;

	constructor(value: bigint) {
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		return variableIntToBytesBigEndian(this.value);
	}
}

export class ASN1BitString implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.BIT_STRING;
	public value: Uint8Array;
	public length: number;

	constructor(value: Uint8Array, length: number) {
		if (length > value.byteLength * 8) {
			throw new TypeError();
		}
		this.value = value;
		this.length = length;
	}

	public encodeContents(): Uint8Array {
		let remainingBitsInLastByte = 8 - (this.length % 8);
		if (remainingBitsInLastByte === 8) {
			remainingBitsInLastByte = 0;
		}
		const encoded = new Uint8Array(this.value.byteLength + 1);
		encoded[0] = remainingBitsInLastByte;
		encoded.set(this.value, 1);
		return encoded;
	}
}

export class ASN1Enumerated implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.ENUMERATED;
	public value: bigint;

	constructor(value: bigint) {
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		return variableIntToBytesBigEndian(this.value);
	}
}

export class ASN1RealBinaryEncoding implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.REAL;
	public mantissa: bigint;
	public base: RealBinaryEncodingBase;
	public exponent: bigint;

	constructor(mantissa: bigint, base: RealBinaryEncodingBase, exponent: bigint) {
		if (mantissa === 0n) {
			throw new TypeError("The mantissa cannot be zero");
		}
		this.mantissa = mantissa;
		this.base = base;
		this.exponent = exponent;
	}

	public encodeContents(): Uint8Array {
		let N: bigint, scalingFactor: number;
		if (this.mantissa % 8n === 0n) {
			N = absBigInt(this.mantissa) / 8n;
			scalingFactor = 3;
		} else if (this.mantissa % 4n === 0n) {
			N = absBigInt(this.mantissa) / 4n;
			scalingFactor = 2;
		} else if (this.mantissa % 2n === 0n) {
			N = absBigInt(this.mantissa) / 2n;
			scalingFactor = 1;
		} else {
			N = absBigInt(this.mantissa);
			scalingFactor = 0;
		}

		let firstByte = 0x80;
		if (this.mantissa < 0) {
			firstByte |= 0x40;
		}
		if (this.base === RealBinaryEncodingBase.Base8) {
			firstByte |= 0x10;
		} else if (this.base === RealBinaryEncodingBase.Base16) {
			firstByte |= 0x20;
		}
		firstByte |= scalingFactor << 2;

		let encodedExponent: Uint8Array;
		const exponentBytes = variableIntToBytesBigEndian(this.exponent);
		if (exponentBytes.byteLength === 1) {
			encodedExponent = new Uint8Array(1);
			encodedExponent.set(exponentBytes);
		} else if (exponentBytes.byteLength === 2) {
			firstByte |= 0x01;
			encodedExponent = new Uint8Array(2);
			encodedExponent.set(exponentBytes);
		} else if (exponentBytes.byteLength === 3) {
			firstByte |= 0x02;
			encodedExponent = new Uint8Array(3);
			encodedExponent.set(exponentBytes);
		} else {
			if (exponentBytes.byteLength > 255) {
				throw new ASN1InvalidError();
			}
			firstByte |= 0x03;
			encodedExponent = new Uint8Array(exponentBytes.byteLength + 1);
			encodedExponent[0] = exponentBytes.byteLength;
			encodedExponent.set(exponentBytes, 1);
		}

		const encodedN = variableUintToBytesBigEndian(N);
		const encoded = new Uint8Array(1 + encodedExponent.byteLength + encodedN.byteLength);
		encoded[0] = firstByte;
		encoded.set(encodedExponent, 1);
		encoded.set(encodedN, 1 + encodedExponent.byteLength);
		return encoded;
	}
}

function absBigInt(value: bigint): bigint {
	if (value < 0) {
		return value * -1n;
	}
	return value;
}

export const enum RealBinaryEncodingBase {
	Base2 = 0,
	Base8,
	Base16
}

export class ASN1RealDecimalEncoding implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.REAL;

	public encodingFormat: RealDecimalEncodingFormat;
	public value: Uint8Array;

	constructor(encodingFormat: RealDecimalEncodingFormat, value: Uint8Array) {
		this.encodingFormat = encodingFormat;
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		const encoded = new Uint8Array(1 + this.value.byteLength);
		if (this.encodingFormat === RealDecimalEncodingFormat.ISO6093NR1) {
			encoded[0] = 0x01;
		} else if (this.encodingFormat === RealDecimalEncodingFormat.ISO6093NR2) {
			encoded[0] = 0x02;
		} else if (this.encodingFormat === RealDecimalEncodingFormat.ISO6093NR3) {
			encoded[0] = 0x03;
		}
		encoded.set(this.value, 1);
		return encoded;
	}
}

export const enum RealDecimalEncodingFormat {
	ISO6093NR1 = 0,
	ISO6093NR2,
	ISO6093NR3
}

export class ASN1SpecialReal implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.REAL;
	public value: SpecialReal;

	constructor(value: SpecialReal) {
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		switch (this.value) {
			case SpecialReal.PlusInfinity:
				return new Uint8Array([0x40]);
			case SpecialReal.MinusInfinity:
				return new Uint8Array([0x41]);
		}
	}
}

export const enum SpecialReal {
	PlusInfinity = 0,
	MinusInfinity
}

export class ASN1RealZero implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.REAL;
	public value = 0;

	public encodeContents(): Uint8Array {
		return new Uint8Array(0);
	}
}

export class ASN1OctetString implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.OCTET_STRING;
	public value: Uint8Array;

	constructor(value: Uint8Array) {
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		return this.value;
	}
}

export class ASN1Null implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.NULL;

	public encodeContents(): Uint8Array {
		return new Uint8Array(0);
	}
}

export class ASN1Sequence implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.SEQUENCE;
	public items: ASN1Value[];

	constructor(items: ASN1Value[]) {
		this.items = items;
	}

	public encodeContents(): Uint8Array {
		const buffer = new DynamicBuffer(0);
		for (const item of this.items) {
			buffer.write(encodeASN1(item));
		}
		return buffer.bytes();
	}

	public toObject<_Key extends string>(keys: _Key[]): Record<_Key, ASN1Value> {
		if (this.items.length !== keys.length) {
			throw new Error();
		}
		const result = {} as Record<_Key, ASN1Value>;
		for (let i = 0; i < keys.length; i++) {
			result[keys[i]] = this.items[i];
		}
		return result;
	}

	public isSequenceOfSingleType(
		asn1Class: ASN1Class,
		type: ASN1EncodingType,
		tag: number
	): boolean {
		for (const item of this.items) {
			if (item.class !== asn1Class || item.type !== type || item.tag !== tag) {
				return false;
			}
		}
		return true;
	}
}

export class ASN1Set implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.SET;
	public items: ASN1Value[];

	constructor(items: ASN1Value[]) {
		this.items = items;
	}

	public encodeContents(): Uint8Array {
		const buffer = new DynamicBuffer(0);
		for (const item of this.items) {
			buffer.write(encodeASN1(item));
		}
		return buffer.bytes();
	}

	public isSetOfSingleType(asn1Class: ASN1Class, type: ASN1EncodingType, tag: number): boolean {
		for (const item of this.items) {
			if (item.class !== asn1Class || item.type !== type || item.tag !== tag) {
				return false;
			}
		}
		return true;
	}
}

export class ASN1ObjectIdentifier implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.OBJECT_IDENTIFIER;
	public encodedId: Uint8Array;

	constructor(encodedId: Uint8Array) {
		this.encodedId = encodedId;
	}

	public encodeContents(): Uint8Array {
		return this.encodedId;
	}
}

// TODO?: relative object identifier

export class ASN1NumericString implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.NUMERIC_STRING;
	public value: Uint8Array;

	constructor(value: Uint8Array) {
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		return this.value;
	}

	public decodeText(): string {
		for (let i = 0; i < this.value.byteLength; i++) {
			if (this.value[i] === 0x20) {
				continue;
			}
			if (this.value[i] >= 0x30 && this.value[i] <= 0x39) {
				continue;
			}
			throw new TypeError("Invalid numeric string");
		}
		return new TextDecoder().decode(this.value);
	}
}

export class ASN1PrintableString implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.PRINTABLE_STRING;
	public value: Uint8Array;

	constructor(value: Uint8Array) {
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		return this.value;
	}

	public decodeText(): string {
		for (let i = 0; i < this.value.byteLength; i++) {
			if (this.value[i] === 0x20) {
				continue;
			}
			if (this.value[i] >= 0x27 && this.value[i] >= 0x29) {
				continue;
			}
			if (this.value[i] >= 0x2b && this.value[i] >= 0x2f) {
				continue;
			}
			if (this.value[i] >= 0x30 && this.value[i] <= 0x39) {
				continue;
			}
			if (this.value[i] === 0x3d) {
				continue;
			}
			if (this.value[i] === 0x3f) {
				continue;
			}
			if (this.value[i] >= 0x41 && this.value[i] <= 0x5a) {
				continue;
			}
			if (this.value[i] >= 0x61 && this.value[i] <= 0x7a) {
				continue;
			}
			throw new TypeError("Invalid printable string");
		}
		return new TextDecoder().decode(this.value);
	}
}

export class ASN1UTF8String implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.UTF8_STRING;
	public value: Uint8Array;

	constructor(value: Uint8Array) {
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		return this.value;
	}

	public decodeText(): string {
		return new TextDecoder().decode(this.value);
	}
}

export class ASN1IA5String implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.IA5_STRING;
	public value: Uint8Array;

	constructor(value: Uint8Array) {
		this.value = value;
	}

	public encodeContents(): Uint8Array {
		return this.value;
	}

	public decodeText(): string {
		return decodeASCII(this.value);
	}
}

export class ASN1GeneralizedTime implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.GENERALIZED_TIME;

	public year: number;
	public month: number;
	public date: number;
	public hours: number;
	public minutes: number;
	public seconds: number;
	public milliseconds: number;

	constructor(
		year: number,
		month: number,
		date: number,
		hours: number,
		minutes: number,
		seconds: number,
		milliseconds: number
	) {
		if (!Number.isInteger(year) || year < 0 || year > 9999) {
			throw new TypeError("Invalid year");
		}
		if (!Number.isInteger(month) || month < 1 || month > 12) {
			throw new TypeError("Invalid month");
		}
		if (!Number.isInteger(date) || date < 1 || date > 99) {
			throw new TypeError("Invalid date");
		}
		if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
			throw new TypeError("Invalid hours");
		}
		if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
			throw new TypeError("Invalid minutes");
		}
		if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
			throw new TypeError("Invalid seconds");
		}
		if (!Number.isInteger(milliseconds) || milliseconds < 0 || milliseconds > 999) {
			throw new TypeError("Invalid milliseconds");
		}
		this.year = year;
		this.month = month;
		this.date = date;
		this.hours = hours;
		this.minutes = minutes;
		this.seconds = seconds;
		this.milliseconds = milliseconds;
	}

	public encodeContents(): Uint8Array {
		let text = this.year.toString().padStart(4, "0");
		text += this.month.toString().padStart(2, "0");
		text += this.date.toString().padStart(2, "0");
		text += this.hours.toString().padStart(2, "0");
		text += this.minutes.toString().padStart(2, "0");
		text += this.seconds.toString().padStart(2, "0");
		if (this.milliseconds > 0) {
			text += (this.milliseconds / 1000).toString().replace("0", "");
		}
		text += "Z";
		return new TextEncoder().encode(text);
	}

	public toDate(): Date {
		const date = new Date();
		date.setUTCFullYear(this.year);
		date.setUTCMonth(this.month - 1);
		date.setUTCDate(this.date);
		date.setUTCHours(this.hours);
		date.setUTCMinutes(this.minutes);
		date.setUTCSeconds(this.seconds);
		date.setUTCMilliseconds(this.milliseconds);
		return date;
	}
}

export class ASN1UTCTime implements ASN1Value {
	public class = ASN1Class.Universal;
	public type = ASN1EncodingType.Primitive;
	public tag = ASN1_UNIVERSAL_TAG.UTC_TIME;

	public year: number;
	public month: number;
	public date: number;
	public hours: number;
	public minutes: number;
	public seconds: number;

	constructor(
		year: number,
		month: number,
		date: number,
		hours: number,
		minutes: number,
		seconds: number
	) {
		if (!Number.isInteger(year) || year < 0 || year > 99) {
			throw new TypeError("Invalid year");
		}
		if (!Number.isInteger(month) || month < 1 || month > 12) {
			throw new TypeError("Invalid month");
		}
		if (!Number.isInteger(date) || date < 1 || date > 99) {
			throw new TypeError("Invalid date");
		}
		if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
			throw new TypeError("Invalid hours");
		}
		if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
			throw new TypeError("Invalid minutes");
		}
		if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
			throw new TypeError("Invalid seconds");
		}
		this.year = year;
		this.month = month;
		this.date = date;
		this.hours = hours;
		this.minutes = minutes;
		this.seconds = seconds;
	}

	public encodeContents(): Uint8Array {
		let text = this.year.toString().padStart(2, "0");
		text += this.month.toString().padStart(2, "0");
		text += this.date.toString().padStart(2, "0");
		text += this.hours.toString().padStart(2, "0");
		text += this.minutes.toString().padStart(2, "0");
		text += this.seconds.toString().padStart(2, "0");
		text += "Z";
		return new TextEncoder().encode(text);
	}

	public toDate(century: number): Date {
		if (century < 0 || century > 99) {
			throw new TypeError("Invalid century");
		}
		const date = new Date();
		date.setUTCFullYear(century * 100 + this.year);
		date.setUTCMonth(this.month - 1);
		date.setUTCDate(this.date);
		date.setUTCHours(this.hours);
		date.setUTCMinutes(this.minutes);
		date.setUTCSeconds(this.seconds);
		return date;
	}
}

export class ASN1EncodedValue implements ASN1Value {
	public class: ASN1Class;
	public type: ASN1EncodingType;
	public tag: number;
	public contents: Uint8Array;

	constructor(asn1Class: ASN1Class, type: ASN1EncodingType, tag: number, value: Uint8Array) {
		this.class = asn1Class;
		this.type = type;
		this.tag = tag;
		this.contents = value;
	}

	public encodeContents(): Uint8Array {
		return this.contents;
	}
}

export interface ASN1Value {
	class: ASN1Class;
	type: ASN1EncodingType;
	tag: number;

	encodeContents(): Uint8Array;
}

export const enum ASN1Class {
	Universal = 0,
	Application,
	ContextSpecific,
	Private
}

export const enum ASN1EncodingType {
	Primitive = 0,
	Constructed = 1
}

export function encodeObjectIdentifier(id: string): Uint8Array {
	const parts = id.split(".");
	const components: number[] = [];
	for (let i = 0; i < parts.length; i++) {
		const parsed = Number(parts[i]);
		if (!Number.isInteger(parsed) || parsed < 0) {
			throw new TypeError("Invalid object identifier");
		}
		components[i] = parsed;
	}
	if (components.length < 2) {
		throw new TypeError("Invalid object identifier");
	}
	const firstSubidentifier = components[0] * 40 + components[1];
	const buffer = new DynamicBuffer(0);
	buffer.write(variableLengthQuantityBigEndian(BigInt(firstSubidentifier)));
	for (let i = 2; i < components.length; i++) {
		buffer.write(variableLengthQuantityBigEndian(BigInt(components[i])));
	}
	return buffer.bytes();
}

export const ASN1_UNIVERSAL_TAG = {
	BOOLEAN: 1,
	INTEGER: 2,
	BIT_STRING: 3,
	OCTET_STRING: 4,
	NULL: 5,
	OBJECT_IDENTIFIER: 6,
	OBJECT_DESCRIPTOR: 7,
	EXTERNAL: 8,
	REAL: 9,
	ENUMERATED: 10,
	EMBEDDED_PDV: 11,
	UTF8_STRING: 12,
	RELATIVE_OBJECT_IDENTIFIER: 13,
	TIME: 14,
	SEQUENCE: 16,
	SET: 17,
	NUMERIC_STRING: 18,
	PRINTABLE_STRING: 19,
	TELETEX_STRING: 20,
	VIDEOTEX_STRING: 21,
	IA5_STRING: 22,
	UTC_TIME: 23,
	GENERALIZED_TIME: 24,
	GRAPHIC_STRING: 25,
	VISIBLE_STRING: 26,
	GENERAL_STRING: 27,
	UNIVERSAL_STRING: 28,
	CHARACTER_STRING: 29,
	BMP_STRING: 30
} as const;
