import { expect, test } from "vitest";
import { encodeASN1 } from "./encode.js";
import { ASN1Class, ASN1EncodedValue, ASN1EncodingType } from "./asn1.js";

test("encodeASN1", () => {
	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 0, new Uint8Array())
		)
	).toStrictEqual(new Uint8Array([0b00000000, 0x00]));

	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Application, ASN1EncodingType.Primitive, 0, new Uint8Array())
		)
	).toStrictEqual(new Uint8Array([0b01000000, 0x00]));

	expect(
		encodeASN1(
			new ASN1EncodedValue(
				ASN1Class.ContextSpecific,
				ASN1EncodingType.Primitive,
				0,
				new Uint8Array()
			)
		)
	).toStrictEqual(new Uint8Array([0b10000000, 0x00]));

	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Private, ASN1EncodingType.Primitive, 0, new Uint8Array())
		)
	).toStrictEqual(new Uint8Array([0b11000000, 0x00]));

	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Constructed, 0, new Uint8Array())
		)
	).toStrictEqual(new Uint8Array([0b00100000, 0x00]));

	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 1, new Uint8Array())
		)
	).toStrictEqual(new Uint8Array([0x01, 0x00]));

	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 30, new Uint8Array())
		)
	).toStrictEqual(new Uint8Array([0x1e, 0x00]));

	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 8192, new Uint8Array())
		)
	).toStrictEqual(new Uint8Array([0x1f, 0xc0, 0x00, 0x00]));
	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 0, new Uint8Array(127))
		)
	).toStrictEqual(new Uint8Array([0x00, 0x7f, ...new Uint8Array(127)]));
	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 0, new Uint8Array(128))
		)
	).toStrictEqual(new Uint8Array([0x00, 0x81, 0x80, ...new Uint8Array(128)]));
	expect(
		encodeASN1(
			new ASN1EncodedValue(ASN1Class.Universal, ASN1EncodingType.Primitive, 0, new Uint8Array(256))
		)
	).toStrictEqual(new Uint8Array([0x00, 0x82, 0x01, 0x00, ...new Uint8Array(256)]));
});
