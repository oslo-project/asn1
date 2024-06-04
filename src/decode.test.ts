import { test, expect, describe } from "vitest";
import { decodeASN1NoLeftoverBytes, parseASN1 } from "./decode.js";
import {
	ASN1GeneralizedTime,
	ASN1UTCTime,
	ASN1BitString,
	ASN1Boolean,
	ASN1Class,
	ASN1EncodedValue,
	ASN1EncodingType,
	ASN1IA5String,
	ASN1Integer,
	ASN1Null,
	ASN1NumericString,
	ASN1ObjectIdentifier,
	ASN1OctetString,
	ASN1PrintableString,
	ASN1RealBinaryEncoding,
	ASN1RealDecimalEncoding,
	ASN1RealZero,
	ASN1Sequence,
	ASN1Set,
	ASN1SpecialReal,
	ASN1UTF8String,
	RealBinaryEncodingBase,
	RealDecimalEncodingFormat,
	SpecialReal
} from "./asn1";

test("parseASN1", () => {
	expect(parseASN1(new Uint8Array([0b00000000, 0x00]))).toStrictEqual([
		new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 0, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0b01000000, 0x00]))).toStrictEqual([
		new ASN1EncodedValue(ASN1Class.Application, ASN1EncodingType.Primitive, 0, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0b10000000, 0x00]))).toStrictEqual([
		new ASN1EncodedValue(
			ASN1Class.ContextSpecific,
			ASN1EncodingType.Primitive,
			0,
			new Uint8Array()
		),
		2
	]);

	expect(parseASN1(new Uint8Array([0b11000000, 0x00]))).toStrictEqual([
		new ASN1EncodedValue(ASN1Class.Private, ASN1EncodingType.Primitive, 0, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0b00100000, 0x00]))).toStrictEqual([
		new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Constructed, 0, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0x01, 0x00]))).toStrictEqual([
		new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 1, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0x1e, 0x00]))).toStrictEqual([
		new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 30, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0x1f, 0xc0, 0x00, 0x00]))).toStrictEqual([
		new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 8192, new Uint8Array()),
		4
	]);

	expect(parseASN1(new Uint8Array([0x00, 0x7f, ...new Uint8Array(127)]))).toStrictEqual([
		new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 0, new Uint8Array(127)),
		129
	]);

	expect(parseASN1(new Uint8Array([0x00, 0x81, 0x80, ...new Uint8Array(128)]))).toStrictEqual([
		new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 0, new Uint8Array(128)),
		131
	]);

	expect(parseASN1(new Uint8Array([0x00, 0x82, 0x01, 0x00, ...new Uint8Array(256)]))).toStrictEqual(
		[
			new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 0, new Uint8Array(256)),
			256 + 4
		]
	);
});

describe("decodeASN1IntoKnownValues()", () => {
	test("Boolean", () => {
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x01, 0x01, 0xff]), 10)).toStrictEqual(
			new ASN1Boolean(true)
		);
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x01, 0x01, 0x00]), 10)).toStrictEqual(
			new ASN1Boolean(false)
		);
	});

	test("Integer", () => {
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x02, 0x01, 0x00]), 10)).toStrictEqual(
			new ASN1Integer(0n)
		);
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x02, 0x01, 0x01]), 10)).toStrictEqual(
			new ASN1Integer(1n)
		);
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x02, 0x02, 0x00, 0x80]), 10)).toStrictEqual(
			new ASN1Integer(128n)
		);
		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([
					0x02, 0x1c, 0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4,
					0x7d, 0xf6, 0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
				]),
				10
			)
		).toStrictEqual(
			new ASN1Integer(5476057457410545405175640567415649081748931656501235026509713265394n)
		);
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x02, 0x01, 0xff]), 10)).toStrictEqual(
			new ASN1Integer(-1n)
		);
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x02, 0x02, 0xff, 0x7f]), 10)).toStrictEqual(
			new ASN1Integer(-129n)
		);
	});

	test("Bit string", () => {
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x03, 0x01, 0x00]), 10)).toStrictEqual(
			new ASN1BitString(new Uint8Array(), 0)
		);
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x03, 0x02, 0x01, 0xff]), 10)).toStrictEqual(
			new ASN1BitString(new Uint8Array([0xff]), 7)
		);
		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([
					0x03, 0x0b, 0x07, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a
				]),
				10
			)
		).toStrictEqual(
			new ASN1BitString(
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a]),
				73
			)
		);
	});

	test("Octet string", () => {
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x04, 0x00]), 10)).toStrictEqual(
			new ASN1OctetString(new Uint8Array())
		);
		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([0x04, 0x0a, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a]),
				10
			)
		).toStrictEqual(
			new ASN1OctetString(
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a])
			)
		);
	});

	test("Null", () => {
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x05, 0x00]), 10)).toStrictEqual(
			new ASN1Null()
		);
	});

	test("Object identifier", () => {
		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02]),
				10
			)
		).toStrictEqual(
			new ASN1ObjectIdentifier(new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02]))
		);
	});

	test("Real", () => {
		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x00]), 10)).toStrictEqual(
			new ASN1RealZero()
		);

		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x01, 0x40]), 10)).toStrictEqual(
			new ASN1SpecialReal(SpecialReal.PlusInfinity)
		);

		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x01, 0x41]), 10)).toStrictEqual(
			new ASN1SpecialReal(SpecialReal.MinusInfinity)
		);

		// mantissa: 32 = 1 * 4 * 2 ** 3
		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x03, 0b10001100, 0x05, 0x04]), 10)
		).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 5n));

		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x03, 0b10011100, 0x05, 0x04]), 10)
		).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base8, 5n));

		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x03, 0b10101100, 0x05, 0x04]), 10)
		).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base16, 5n));

		// mantissa = -1 * 4 * 2 ** 3
		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x03, 0b11001100, 0x05, 0x04]), 10)
		).toStrictEqual(new ASN1RealBinaryEncoding(-32n, RealBinaryEncodingBase.Base2, 5n));

		// mantissa: 262136 = 1 * 32767 * 2 ** 3
		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x04, 0b10001100, 0x05, 0x7f, 0xff]), 10)
		).toStrictEqual(new ASN1RealBinaryEncoding(262136n, RealBinaryEncodingBase.Base2, 5n));

		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x04, 0b10001101, 0x00, 0x80, 0x04]), 10)
		).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 128n));

		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x04, 0b10001101, 0xff, 0x7f, 0x04]), 10)
		).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, -129n));

		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([0x09, 0x05, 0b10001110, 0x00, 0x80, 0x00, 0x04]),
				10
			)
		).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 32768n));

		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([0x09, 0x07, 0b10001111, 0x04, 0x00, 0x80, 0x00, 0x00, 0x04]),
				10
			)
		).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 8388608n));

		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x02, 0x01, 0xff]), 10)).toStrictEqual(
			new ASN1RealDecimalEncoding(RealDecimalEncodingFormat.ISO6093NR1, new Uint8Array([0xff]))
		);

		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x02, 0x02, 0xff]), 10)).toStrictEqual(
			new ASN1RealDecimalEncoding(RealDecimalEncodingFormat.ISO6093NR2, new Uint8Array([0xff]))
		);

		expect(decodeASN1NoLeftoverBytes(new Uint8Array([0x09, 0x02, 0x03, 0xff]), 10)).toStrictEqual(
			new ASN1RealDecimalEncoding(RealDecimalEncodingFormat.ISO6093NR3, new Uint8Array([0xff]))
		);
	});

	test("Sequence", () => {
		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([0x30, 0x09, 0x01, 0x01, 0xff, 0x01, 0x01, 0x00, 0x01, 0x01, 0xff]),
				10
			)
		).toStrictEqual(
			new ASN1Sequence([new ASN1Boolean(true), new ASN1Boolean(false), new ASN1Boolean(true)])
		);
	});

	test("Set", () => {
		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([0x31, 0x09, 0x01, 0x01, 0xff, 0x01, 0x01, 0x00, 0x01, 0x01, 0xff]),
				10
			)
		).toStrictEqual(
			new ASN1Set([new ASN1Boolean(true), new ASN1Boolean(false), new ASN1Boolean(true)])
		);
	});

	test("UTF8String", () => {
		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x0c, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05]), 10)
		).toStrictEqual(new ASN1UTF8String(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])));
	});

	test("IA5String", () => {
		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x16, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05]), 10)
		).toStrictEqual(new ASN1IA5String(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])));
	});

	test("PrintableString", () => {
		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x13, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05]), 10)
		).toStrictEqual(new ASN1PrintableString(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])));
	});

	test("NumericString", () => {
		expect(
			decodeASN1NoLeftoverBytes(new Uint8Array([0x12, 0x05, 0x01, 0x02, 0x03, 0x04, 0x05]), 10)
		).toStrictEqual(new ASN1NumericString(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])));
	});

	test("GeneralizedTime", () => {
		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([
					0x18, 0x0f, 0x32, 0x30, 0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35,
					0x34, 0x5a
				]),
				10
			)
		).toStrictEqual(new ASN1GeneralizedTime(2000, 12, 31, 10, 40, 54, 0));
		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([
					0x18, 0x13, 0x32, 0x30, 0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35,
					0x34, 0x2e, 0x31, 0x31, 0x31, 0x5a
				]),
				10
			)
		).toStrictEqual(new ASN1GeneralizedTime(2000, 12, 31, 10, 40, 54, 111));
	});

	test("UTCTime", () => {
		expect(
			decodeASN1NoLeftoverBytes(
				new Uint8Array([
					0x17, 0x0d, 0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x5a
				]),
				10
			)
		).toStrictEqual(new ASN1UTCTime(0, 12, 31, 10, 40, 54));
	});
});
