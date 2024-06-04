import { test, expect, describe } from "vitest";
import {
	ASN1GeneralizedTime,
	ASN1UTCTime,
	ASN1BitString,
	ASN1Boolean,
	ASN1Integer,
	ASN1Null,
	ASN1ObjectIdentifier,
	ASN1OctetString,
	ASN1RealBinaryEncoding,
	ASN1RealDecimalEncoding,
	ASN1RealZero,
	ASN1Sequence,
	ASN1Set,
	ASN1SpecialReal,
	encodeObjectIdentifier,
	RealBinaryEncodingBase,
	RealDecimalEncodingFormat,
	SpecialReal,
	ASN1Class,
	ASN1EncodingType
} from "./asn1.js";

test("encodeObjectIdentifier()", () => {
	expect(encodeObjectIdentifier("2.100.3")).toStrictEqual(new Uint8Array([0x81, 0x34, 0x03]));
	expect(encodeObjectIdentifier("1.2.840.10045.4.3.2")).toStrictEqual(
		new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02])
	);
});

describe("ASN1Boolean", () => {
	test("ASN1Boolean.encodeContents()", () => {
		expect(new ASN1Boolean(true).encodeContents()).toStrictEqual(new Uint8Array([0xff]));
		expect(new ASN1Boolean(false).encodeContents()).toStrictEqual(new Uint8Array([0x00]));
	});
});

describe("ASN1Integer", () => {
	test("ASN1Integer.encodeContents()", () => {
		expect(new ASN1Integer(0n).encodeContents()).toStrictEqual(new Uint8Array([0x00]));
		expect(new ASN1Integer(1n).encodeContents()).toStrictEqual(new Uint8Array([0x01]));
		expect(new ASN1Integer(128n).encodeContents()).toStrictEqual(new Uint8Array([0x00, 0x80]));
		expect(
			new ASN1Integer(
				5476057457410545405175640567415649081748931656501235026509713265394n
			).encodeContents()
		).toStrictEqual(
			new Uint8Array([
				0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
				0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
			])
		);
		expect(new ASN1Integer(-1n).encodeContents()).toStrictEqual(new Uint8Array([0xff]));
		expect(new ASN1Integer(-129n).encodeContents()).toStrictEqual(new Uint8Array([0xff, 0x7f]));
	});
});

describe("ASN1BitString", () => {
	test("ASN1BitString.encodeContents()", () => {
		expect(new ASN1BitString(new Uint8Array(), 0).encodeContents()).toStrictEqual(
			new Uint8Array([0x00])
		);
		expect(new ASN1BitString(new Uint8Array([0xff]), 7).encodeContents()).toStrictEqual(
			new Uint8Array([0x01, 0xff])
		);
		expect(
			new ASN1BitString(
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a]),
				73
			).encodeContents()
		).toStrictEqual(
			new Uint8Array([0x07, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a])
		);
	});
});

describe("ASN1OctetString", () => {
	test("ASN1OctetString.encodeContents()", () => {
		expect(new ASN1OctetString(new Uint8Array()).encodeContents()).toStrictEqual(new Uint8Array());
		expect(
			new ASN1OctetString(
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a])
			).encodeContents()
		).toStrictEqual(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a]));
	});
});

describe("ASN1Null", () => {
	test("ASN1Null.encodeContents()", () => {
		expect(new ASN1Null().encodeContents()).toStrictEqual(new Uint8Array());
	});
});

describe("ASN1ObjectIdentifier", () => {
	test("ASN1ObjectIdentifier.encodeContents()", () => {
		expect(
			new ASN1ObjectIdentifier(
				new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02])
			).encodeContents()
		).toStrictEqual(new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02]));
	});
});

describe("ASN1RealZero", () => {
	test("ASN1RealZero.encodeContents()", () => {
		expect(new ASN1RealZero().encodeContents()).toStrictEqual(new Uint8Array());
	});
});

describe("ASN1SpecialReal", () => {
	test("ASN1SpecialReal.encodeContents()", () => {
		expect(new ASN1SpecialReal(SpecialReal.PlusInfinity).encodeContents()).toStrictEqual(
			new Uint8Array([0x40])
		);
		expect(new ASN1SpecialReal(SpecialReal.MinusInfinity).encodeContents()).toStrictEqual(
			new Uint8Array([0x41])
		);
	});
});

describe("ASN1RealBinaryEncoding", () => {
	test("ASN1RealBinaryEncoding.encodeContents()", () => {
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 5n).encodeContents()
		).toStrictEqual(new Uint8Array([0b10001100, 0x05, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base8, 5n).encodeContents()
		).toStrictEqual(new Uint8Array([0b10011100, 0x05, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base16, 5n).encodeContents()
		).toStrictEqual(new Uint8Array([0b10101100, 0x05, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(-32n, RealBinaryEncodingBase.Base2, 5n).encodeContents()
		).toStrictEqual(new Uint8Array([0b11001100, 0x05, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(262136n, RealBinaryEncodingBase.Base2, 5n).encodeContents()
		).toStrictEqual(new Uint8Array([0b10001100, 0x05, 0x7f, 0xff]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 128n).encodeContents()
		).toStrictEqual(new Uint8Array([0b10001101, 0x00, 0x80, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, -129n).encodeContents()
		).toStrictEqual(new Uint8Array([0b10001101, 0xff, 0x7f, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 32768n).encodeContents()
		).toStrictEqual(new Uint8Array([0b10001110, 0x00, 0x80, 0x00, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 8388608n).encodeContents()
		).toStrictEqual(new Uint8Array([0b10001111, 0x04, 0x00, 0x80, 0x00, 0x00, 0x04]));
	});
});

describe("ASN1RealDecimalEncoding", () => {
	test("ASN1RealDecimalEncoding.encodeContents()", () => {
		expect(
			new ASN1RealDecimalEncoding(
				RealDecimalEncodingFormat.ISO6093NR1,
				new Uint8Array([0xff])
			).encodeContents()
		).toStrictEqual(new Uint8Array([0x01, 0xff]));
		expect(
			new ASN1RealDecimalEncoding(
				RealDecimalEncodingFormat.ISO6093NR2,
				new Uint8Array([0xff])
			).encodeContents()
		).toStrictEqual(new Uint8Array([0x02, 0xff]));
		expect(
			new ASN1RealDecimalEncoding(
				RealDecimalEncodingFormat.ISO6093NR3,
				new Uint8Array([0xff])
			).encodeContents()
		).toStrictEqual(new Uint8Array([0x03, 0xff]));
	});
});

describe("ASN1Sequence", () => {
	test("ASN1Sequence.encodeContents()", () => {
		expect(
			new ASN1Sequence([
				new ASN1Boolean(true),
				new ASN1Boolean(false),
				new ASN1Boolean(true)
			]).encodeContents()
		).toStrictEqual(new Uint8Array([0x01, 0x01, 0xff, 0x01, 0x01, 0x00, 0x01, 0x01, 0xff]));
	});

	test("ASN1Sequence.toObject()", () => {
		expect(
			new ASN1Sequence([
				new ASN1Boolean(true),
				new ASN1Boolean(false),
				new ASN1Boolean(true)
			]).toObject(["a", "b", "c"])
		).toStrictEqual({
			a: new ASN1Boolean(true),
			b: new ASN1Boolean(false),
			c: new ASN1Boolean(true)
		});
	});

	test("ASN1Sequence.isSequenceOfSingleType()", () => {
		expect(
			new ASN1Sequence([
				new ASN1Boolean(true),
				new ASN1Boolean(false),
				new ASN1Boolean(true)
			]).isSequenceOfSingleType(ASN1Class.Universal, ASN1EncodingType.Primitive, 1)
		).toBe(true);
		expect(
			new ASN1Sequence([
				new ASN1Boolean(true),
				new ASN1Boolean(false),
				new ASN1Integer(1n)
			]).isSequenceOfSingleType(ASN1Class.Universal, ASN1EncodingType.Primitive, 1)
		).toBe(false);
	});
});

describe("ASN1Set", () => {
	test("ASN1Set.encodeContents()", () => {
		expect(
			new ASN1Set([
				new ASN1Boolean(true),
				new ASN1Boolean(false),
				new ASN1Boolean(true)
			]).encodeContents()
		).toStrictEqual(new Uint8Array([0x01, 0x01, 0xff, 0x01, 0x01, 0x00, 0x01, 0x01, 0xff]));
	});

	test("ASN1Set.isSetOfSingleType()", () => {
		expect(
			new ASN1Set([
				new ASN1Boolean(true),
				new ASN1Boolean(false),
				new ASN1Boolean(true)
			]).isSetOfSingleType(ASN1Class.Universal, ASN1EncodingType.Primitive, 1)
		).toBe(true);
		expect(
			new ASN1Set([
				new ASN1Boolean(true),
				new ASN1Boolean(false),
				new ASN1Integer(1n)
			]).isSetOfSingleType(ASN1Class.Universal, ASN1EncodingType.Primitive, 1)
		).toBe(false);
	});
});

describe("ASN1GeneralizedTime", () => {
	test("ASN1GeneralizedTime.encodeContents()", () => {
		expect(new ASN1GeneralizedTime(2000, 12, 31, 10, 40, 54, 0).encodeContents()).toStrictEqual(
			new Uint8Array([
				0x32, 0x30, 0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x5a
			])
		);
		expect(new ASN1GeneralizedTime(2000, 12, 31, 10, 40, 54, 111).encodeContents()).toStrictEqual(
			new Uint8Array([
				0x32, 0x30, 0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x2e,
				0x31, 0x31, 0x31, 0x5a
			])
		);
	});
});

describe("ASN1UTCTime", () => {
	test("ASN1UTCTime.encodeContents", () => {
		expect(new ASN1UTCTime(0, 12, 31, 10, 40, 54).encodeContents()).toStrictEqual(
			new Uint8Array([0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x5a])
		);
	});
});
