import { describe, expect, test } from "vitest";
import {
	parseASN1,
	ASN1Value,
	ASN1Class,
	ASN1Form,
	encodeObjectIdentifier,
	encodeASN1,
	ASN1Boolean,
	ASN1Integer,
	ASN1RealBinaryEncoding,
	RealBinaryEncodingBase,
	ASN1RealDecimalEncoding,
	RealDecimalEncodingFormat,
	ASN1Sequence,
	ASN1Set,
	ASN1GeneralizedTime,
	ASN1UTCTime,
	ASN1OctetString,
	ASN1BitString,
	ASN1ObjectIdentifier,
	ASN1SpecialReal,
	ASN1RealZero,
	SpecialReal,
	ASN1Null,
	ASN1UTF8String,
	ASN1IA5String,
	ASN1PrintableString,
	ASN1NumericString,
	ASN1EncodableSequence,
	ASN1EncodableSet
} from "./asn1.js";

test("parseASN1", () => {
	expect(parseASN1(new Uint8Array([0b00000000, 0x00]))).toStrictEqual([
		new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 0, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0b01000000, 0x00]))).toStrictEqual([
		new ASN1Value(ASN1Class.Application, ASN1Form.Primitive, 0, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0b10000000, 0x00]))).toStrictEqual([
		new ASN1Value(ASN1Class.ContextSpecific, ASN1Form.Primitive, 0, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0b11000000, 0x00]))).toStrictEqual([
		new ASN1Value(ASN1Class.Private, ASN1Form.Primitive, 0, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0b00100000, 0x00]))).toStrictEqual([
		new ASN1Value(ASN1Class.Universal, ASN1Form.Constructed, 0, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0x01, 0x00]))).toStrictEqual([
		new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0x1e, 0x00]))).toStrictEqual([
		new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 30, new Uint8Array()),
		2
	]);

	expect(parseASN1(new Uint8Array([0x1f, 0xc0, 0x00, 0x00]))).toStrictEqual([
		new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 8192, new Uint8Array()),
		4
	]);

	expect(parseASN1(new Uint8Array([0x00, 0x7f, ...new Uint8Array(127)]))).toStrictEqual([
		new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 0, new Uint8Array(127)),
		129
	]);

	expect(parseASN1(new Uint8Array([0x00, 0x81, 0x80, ...new Uint8Array(128)]))).toStrictEqual([
		new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 0, new Uint8Array(128)),
		131
	]);

	expect(parseASN1(new Uint8Array([0x00, 0x82, 0x01, 0x00, ...new Uint8Array(256)]))).toStrictEqual(
		[new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 0, new Uint8Array(256)), 256 + 4]
	);
});

test("encodeObjectIdentifier()", () => {
	expect(encodeObjectIdentifier("2.100.3")).toStrictEqual(new Uint8Array([0x81, 0x34, 0x03]));
	expect(encodeObjectIdentifier("1.2.840.10045.4.3.2")).toStrictEqual(
		new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02])
	);
});

test("encodeASN1", () => {
	expect(
		encodeASN1(new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 0, new Uint8Array()))
	).toStrictEqual(new Uint8Array([0b00000000, 0x00]));

	expect(
		encodeASN1(new ASN1Value(ASN1Class.Application, ASN1Form.Primitive, 0, new Uint8Array()))
	).toStrictEqual(new Uint8Array([0b01000000, 0x00]));

	expect(
		encodeASN1(new ASN1Value(ASN1Class.ContextSpecific, ASN1Form.Primitive, 0, new Uint8Array()))
	).toStrictEqual(new Uint8Array([0b10000000, 0x00]));

	expect(
		encodeASN1(new ASN1Value(ASN1Class.Private, ASN1Form.Primitive, 0, new Uint8Array()))
	).toStrictEqual(new Uint8Array([0b11000000, 0x00]));

	expect(
		encodeASN1(new ASN1Value(ASN1Class.Universal, ASN1Form.Constructed, 0, new Uint8Array()))
	).toStrictEqual(new Uint8Array([0b00100000, 0x00]));

	expect(
		encodeASN1(new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array()))
	).toStrictEqual(new Uint8Array([0x01, 0x00]));

	expect(
		encodeASN1(new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 30, new Uint8Array()))
	).toStrictEqual(new Uint8Array([0x1e, 0x00]));

	expect(
		encodeASN1(new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 8192, new Uint8Array()))
	).toStrictEqual(new Uint8Array([0x1f, 0xc0, 0x00, 0x00]));
	expect(
		encodeASN1(new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 0, new Uint8Array(127)))
	).toStrictEqual(new Uint8Array([0x00, 0x7f, ...new Uint8Array(127)]));
	expect(
		encodeASN1(new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 0, new Uint8Array(128)))
	).toStrictEqual(new Uint8Array([0x00, 0x81, 0x80, ...new Uint8Array(128)]));
	expect(
		encodeASN1(new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 0, new Uint8Array(256)))
	).toStrictEqual(new Uint8Array([0x00, 0x82, 0x01, 0x00, ...new Uint8Array(256)]));
});

describe("ASN1Value", () => {
	test("ASN1Value.boolean()", () => {
		expect(
			new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0xff])).boolean()
		).toStrictEqual(new ASN1Boolean(true));
		expect(
			new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0x00])).boolean()
		).toStrictEqual(new ASN1Boolean(false));
	});

	test("ASN1Value.integer()", () => {
		expect(
			new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 2, new Uint8Array([0x00])).integer()
		).toStrictEqual(new ASN1Integer(0n));
		expect(
			new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 2, new Uint8Array([0x01])).integer()
		).toStrictEqual(new ASN1Integer(1n));
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				2,
				new Uint8Array([0x00, 0x80])
			).integer()
		).toStrictEqual(new ASN1Integer(128n));
		// 0x02, 0x1c, 0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4,
		// 0x7d, 0xf6, 0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				2,
				new Uint8Array([
					0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
					0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
				])
			).integer()
		).toStrictEqual(
			new ASN1Integer(5476057457410545405175640567415649081748931656501235026509713265394n)
		);
		expect(
			new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 2, new Uint8Array([0xff])).integer()
		).toStrictEqual(new ASN1Integer(-1n));
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				2,
				new Uint8Array([0xff, 0x7f])
			).integer()
		).toStrictEqual(new ASN1Integer(-129n));
	});

	test("ASN1Value.bitString()", () => {
		expect(
			new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 3, new Uint8Array([0x00])).bitString()
		).toStrictEqual(new ASN1BitString(new Uint8Array(), 0));
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				3,
				new Uint8Array([0x01, 0xff])
			).bitString()
		).toStrictEqual(new ASN1BitString(new Uint8Array([0xff]), 7));
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				3,
				new Uint8Array([0x07, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a])
			).bitString()
		).toStrictEqual(
			new ASN1BitString(
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a]),
				73
			)
		);
	});

	test("ASN1Value.octetString()", () => {
		expect(
			new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 4, new Uint8Array([])).octetString()
		).toStrictEqual(new ASN1OctetString(new Uint8Array()));
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				4,
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a])
			).octetString()
		).toStrictEqual(
			new ASN1OctetString(
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a])
			)
		);
	});

	test("ASN1Value.null()", () => {
		expect(
			new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 5, new Uint8Array()).null()
		).toStrictEqual(new ASN1Null());
	});

	test("ASN1Value.objectIdentifier()", () => {
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				6,
				new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02])
			).objectIdentifier()
		).toStrictEqual(
			new ASN1ObjectIdentifier(new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02]))
		);
	});

	describe("ASN1Value.real()", () => {
		test("Zero", () => {
			expect(
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 9, new Uint8Array()).real()
			).toStrictEqual(new ASN1RealZero());
		});

		test("Special()", () => {
			expect(
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 9, new Uint8Array([0x40])).real()
			).toStrictEqual(new ASN1SpecialReal(SpecialReal.PlusInfinity));
			expect(
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 9, new Uint8Array([0x41])).real()
			).toStrictEqual(new ASN1SpecialReal(SpecialReal.MinusInfinity));
		});

		test("Binary encoding", () => {
			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0b10001100, 0x05, 0x04])
				).real()
			).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 5n));

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0b10011100, 0x05, 0x04])
				).real()
			).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base8, 5n));

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0b10101100, 0x05, 0x04])
				).real()
			).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base16, 5n));

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0b11001100, 0x05, 0x04])
				).real()
			).toStrictEqual(new ASN1RealBinaryEncoding(-32n, RealBinaryEncodingBase.Base2, 5n));

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0b10001100, 0x05, 0x7f, 0xff])
				).real()
			).toStrictEqual(new ASN1RealBinaryEncoding(262136n, RealBinaryEncodingBase.Base2, 5n));

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0b10001101, 0x00, 0x80, 0x04])
				).real()
			).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 128n));

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0b10001101, 0xff, 0x7f, 0x04])
				).real()
			).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, -129n));

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0b10001110, 0x00, 0x80, 0x00, 0x04])
				).real()
			).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 32768n));

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0b10001111, 0x04, 0x00, 0x80, 0x00, 0x00, 0x04])
				).real()
			).toStrictEqual(new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 8388608n));
		});

		test("Decimal encoding", () => {
			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0x01, 0xff])
				).real()
			).toStrictEqual(
				new ASN1RealDecimalEncoding(RealDecimalEncodingFormat.ISO6093NR1, new Uint8Array([0xff]))
			);

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0x02, 0xff])
				).real()
			).toStrictEqual(
				new ASN1RealDecimalEncoding(RealDecimalEncodingFormat.ISO6093NR2, new Uint8Array([0xff]))
			);

			expect(
				new ASN1Value(
					ASN1Class.Universal,
					ASN1Form.Primitive,
					9,
					new Uint8Array([0x03, 0xff])
				).real()
			).toStrictEqual(
				new ASN1RealDecimalEncoding(RealDecimalEncodingFormat.ISO6093NR3, new Uint8Array([0xff]))
			);
		});
	});

	test("ASN1Value.sequence()", () => {
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Constructed,
				16,
				new Uint8Array([0x01, 0x01, 0xff, 0x01, 0x01, 0x00, 0x01, 0x01, 0xff])
			).sequence()
		).toStrictEqual(
			new ASN1Sequence([
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0xff])),
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0x00])),
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0xff]))
			])
		);
	});

	test("ASN1Value.set()", () => {
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Constructed,
				17,
				new Uint8Array([0x01, 0x01, 0xff, 0x01, 0x01, 0x00, 0x01, 0x01, 0xff])
			).set()
		).toStrictEqual(
			new ASN1Set([
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0xff])),
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0x00])),
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0xff]))
			])
		);
	});

	test("ASN1Value.utf8String()", () => {
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				12,
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])
			).utf8String()
		).toStrictEqual(new ASN1UTF8String(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])));
	});

	test("ASN1Value.ia5String()", () => {
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				22,
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])
			).ia5String()
		).toStrictEqual(new ASN1IA5String(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])));
	});

	test("ASN1Value.printableString()", () => {
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				19,
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])
			).printableString()
		).toStrictEqual(new ASN1PrintableString(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])));
	});

	test("ASN1Value.numericString()", () => {
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				18,
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])
			).numericString()
		).toStrictEqual(new ASN1NumericString(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05])));
	});

	test("ASN1Value.generalizedTime()", () => {
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				24,
				new Uint8Array([
					0x32, 0x30, 0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x5a
				])
			).generalizedTime()
		).toStrictEqual(new ASN1GeneralizedTime(2000, 12, 31, 10, 40, 54, 0));
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				24,
				new Uint8Array([
					0x32, 0x30, 0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x2e,
					0x31, 0x31, 0x31, 0x5a
				])
			).generalizedTime()
		).toStrictEqual(new ASN1GeneralizedTime(2000, 12, 31, 10, 40, 54, 111));
	});

	test("ASN1Value.utcTime()", () => {
		expect(
			new ASN1Value(
				ASN1Class.Universal,
				ASN1Form.Primitive,
				23,
				new Uint8Array([
					0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x5a
				])
			).utcTime()
		).toStrictEqual(new ASN1UTCTime(0, 12, 31, 10, 40, 54));
	});
});

describe("ASN1Boolean", () => {
	test("ASN1Boolean.contents()", () => {
		expect(new ASN1Boolean(true).contents()).toStrictEqual(new Uint8Array([0xff]));
		expect(new ASN1Boolean(false).contents()).toStrictEqual(new Uint8Array([0x00]));
	});
});

describe("ASN1Integer", () => {
	test("ASN1Integer.contents()", () => {
		expect(new ASN1Integer(0n).contents()).toStrictEqual(new Uint8Array([0x00]));
		expect(new ASN1Integer(1n).contents()).toStrictEqual(new Uint8Array([0x01]));
		expect(new ASN1Integer(128n).contents()).toStrictEqual(new Uint8Array([0x00, 0x80]));
		expect(
			new ASN1Integer(
				5476057457410545405175640567415649081748931656501235026509713265394n
			).contents()
		).toStrictEqual(
			new Uint8Array([
				0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
				0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
			])
		);
		expect(new ASN1Integer(-1n).contents()).toStrictEqual(new Uint8Array([0xff]));
		expect(new ASN1Integer(-129n).contents()).toStrictEqual(new Uint8Array([0xff, 0x7f]));
	});
});

describe("ASN1BitString", () => {
	test("ASN1BitString.contents()", () => {
		expect(new ASN1BitString(new Uint8Array(), 0).contents()).toStrictEqual(new Uint8Array([0x00]));
		expect(new ASN1BitString(new Uint8Array([0xff]), 7).contents()).toStrictEqual(
			new Uint8Array([0x01, 0xff])
		);
		expect(
			new ASN1BitString(
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a]),
				73
			).contents()
		).toStrictEqual(
			new Uint8Array([0x07, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a])
		);
	});
});

describe("ASN1OctetString", () => {
	test("ASN1OctetString.contents()", () => {
		expect(new ASN1OctetString(new Uint8Array()).contents()).toStrictEqual(new Uint8Array());
		expect(
			new ASN1OctetString(
				new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a])
			).contents()
		).toStrictEqual(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a]));
	});
});

describe("ASN1Null", () => {
	test("ASN1Null.contents()", () => {
		expect(new ASN1Null().contents()).toStrictEqual(new Uint8Array());
	});
});

describe("ASN1ObjectIdentifier", () => {
	test("ASN1ObjectIdentifier.contents()", () => {
		expect(
			new ASN1ObjectIdentifier(
				new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02])
			).contents()
		).toStrictEqual(new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02]));
	});
});

describe("ASN1RealZero", () => {
	test("ASN1RealZero.contents()", () => {
		expect(new ASN1RealZero().contents()).toStrictEqual(new Uint8Array());
	});
});

describe("ASN1SpecialReal", () => {
	test("ASN1SpecialReal.contents()", () => {
		expect(new ASN1SpecialReal(SpecialReal.PlusInfinity).contents()).toStrictEqual(
			new Uint8Array([0x40])
		);
		expect(new ASN1SpecialReal(SpecialReal.MinusInfinity).contents()).toStrictEqual(
			new Uint8Array([0x41])
		);
	});
});

describe("ASN1RealBinaryEncoding", () => {
	test("ASN1RealBinaryEncoding.contents()", () => {
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 5n).contents()
		).toStrictEqual(new Uint8Array([0b10001100, 0x05, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base8, 5n).contents()
		).toStrictEqual(new Uint8Array([0b10011100, 0x05, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base16, 5n).contents()
		).toStrictEqual(new Uint8Array([0b10101100, 0x05, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(-32n, RealBinaryEncodingBase.Base2, 5n).contents()
		).toStrictEqual(new Uint8Array([0b11001100, 0x05, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(262136n, RealBinaryEncodingBase.Base2, 5n).contents()
		).toStrictEqual(new Uint8Array([0b10001100, 0x05, 0x7f, 0xff]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 128n).contents()
		).toStrictEqual(new Uint8Array([0b10001101, 0x00, 0x80, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, -129n).contents()
		).toStrictEqual(new Uint8Array([0b10001101, 0xff, 0x7f, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 32768n).contents()
		).toStrictEqual(new Uint8Array([0b10001110, 0x00, 0x80, 0x00, 0x04]));
		expect(
			new ASN1RealBinaryEncoding(32n, RealBinaryEncodingBase.Base2, 8388608n).contents()
		).toStrictEqual(new Uint8Array([0b10001111, 0x04, 0x00, 0x80, 0x00, 0x00, 0x04]));
	});
});

describe("ASN1RealDecimalEncoding", () => {
	test("ASN1RealDecimalEncoding.contents()", () => {
		expect(
			new ASN1RealDecimalEncoding(
				RealDecimalEncodingFormat.ISO6093NR1,
				new Uint8Array([0xff])
			).contents()
		).toStrictEqual(new Uint8Array([0x01, 0xff]));
		expect(
			new ASN1RealDecimalEncoding(
				RealDecimalEncodingFormat.ISO6093NR2,
				new Uint8Array([0xff])
			).contents()
		).toStrictEqual(new Uint8Array([0x02, 0xff]));
		expect(
			new ASN1RealDecimalEncoding(
				RealDecimalEncodingFormat.ISO6093NR3,
				new Uint8Array([0xff])
			).contents()
		).toStrictEqual(new Uint8Array([0x03, 0xff]));
	});
});

describe("ASN1Sequence", () => {
	test("ASN1Sequence.isSequenceOfSingleType()", () => {
		expect(
			new ASN1Sequence([
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0x00])),
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0xff]))
			]).isSequenceOfSingleType(ASN1Class.Universal, ASN1Form.Primitive, 1)
		).toBe(true);
		expect(
			new ASN1Sequence([
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0x00])),
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 2, new Uint8Array([0x01]))
			]).isSequenceOfSingleType(ASN1Class.Universal, ASN1Form.Primitive, 1)
		).toBe(false);
	});
});

describe("ASN1EncodableSequence", () => {
	test("ASN1Sequence.contents()", () => {
		expect(
			new ASN1EncodableSequence([
				new ASN1Boolean(true),
				new ASN1Boolean(false),
				new ASN1Boolean(true)
			]).contents()
		).toStrictEqual(new Uint8Array([0x01, 0x01, 0xff, 0x01, 0x01, 0x00, 0x01, 0x01, 0xff]));
	});
});

describe("ASN1Set", () => {
	test("ASN1Set.isSetOfSingleType()", () => {
		expect(
			new ASN1Set([
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0x00])),
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0xff]))
			]).isSetOfSingleType(ASN1Class.Universal, ASN1Form.Primitive, 1)
		).toBe(true);
		expect(
			new ASN1Set([
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 1, new Uint8Array([0x00])),
				new ASN1Value(ASN1Class.Universal, ASN1Form.Primitive, 2, new Uint8Array([0x01]))
			]).isSetOfSingleType(ASN1Class.Universal, ASN1Form.Primitive, 1)
		).toBe(false);
	});
});

describe("ASN1EncodableSet", () => {
	test("ASN1EncodableSet.contents()", () => {
		expect(
			new ASN1EncodableSet([
				new ASN1Boolean(true),
				new ASN1Boolean(false),
				new ASN1Boolean(true)
			]).contents()
		).toStrictEqual(new Uint8Array([0x01, 0x01, 0xff, 0x01, 0x01, 0x00, 0x01, 0x01, 0xff]));
	});
});

describe("ASN1GeneralizedTime", () => {
	test("ASN1GeneralizedTime.contents()", () => {
		expect(new ASN1GeneralizedTime(2000, 12, 31, 10, 40, 54, 0).contents()).toStrictEqual(
			new Uint8Array([
				0x32, 0x30, 0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x5a
			])
		);
		expect(new ASN1GeneralizedTime(2000, 12, 31, 10, 40, 54, 111).contents()).toStrictEqual(
			new Uint8Array([
				0x32, 0x30, 0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x2e,
				0x31, 0x31, 0x31, 0x5a
			])
		);
	});

	test("ASN1GeneralizedTime.toDate()", () => {
		expect(new ASN1GeneralizedTime(2000, 12, 31, 10, 40, 54, 111).toDate()).toStrictEqual(
			new Date("2000-12-31T10:40:54.111Z")
		);
	});
});

describe("ASN1UTCTime", () => {
	test("ASN1UTCTime.contents()", () => {
		expect(new ASN1UTCTime(0, 12, 31, 10, 40, 54).contents()).toStrictEqual(
			new Uint8Array([0x30, 0x30, 0x31, 0x32, 0x33, 0x31, 0x31, 0x30, 0x34, 0x30, 0x35, 0x34, 0x5a])
		);
	});

	test("ASN1UTCTime.toDate()", () => {
		expect(new ASN1UTCTime(0, 12, 31, 10, 40, 54).toDate(20)).toStrictEqual(
			new Date("2000-12-31T10:40:54Z")
		);
	});
});
