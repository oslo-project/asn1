import { expect, test } from "vitest";
import {
	bigIntTwosComplementBytes,
	bigIntFromTwosComplementBytes,
	variableLengthQuantityBytes,
	variableLengthQuantityFromBytes
} from "./integer.js";

test("bigIntTwosComplementBytes()", () => {
	expect(bigIntTwosComplementBytes(0n)).toStrictEqual(new Uint8Array([0x00]));

	expect(bigIntTwosComplementBytes(1n)).toStrictEqual(new Uint8Array([0x01]));
	expect(bigIntTwosComplementBytes(127n)).toStrictEqual(new Uint8Array([0x7f]));
	expect(bigIntTwosComplementBytes(128n)).toStrictEqual(new Uint8Array([0x00, 0x80]));
	expect(
		bigIntTwosComplementBytes(5476057457410545405175640567415649081748931656501235026509713265394n)
	).toStrictEqual(
		new Uint8Array([
			0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
			0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
		])
	);

	expect(bigIntTwosComplementBytes(-1n)).toStrictEqual(new Uint8Array([0xff]));
	expect(bigIntTwosComplementBytes(-128n)).toStrictEqual(new Uint8Array([0x80]));
	expect(bigIntTwosComplementBytes(-129n)).toStrictEqual(new Uint8Array([0xff, 0x7f]));
	expect(
		bigIntTwosComplementBytes(-5476057457410545405175640567415649081748931656501235026509713265394n)
	).toStrictEqual(
		new Uint8Array([
			0xcc, 0x00, 0x71, 0x13, 0xf8, 0x63, 0xb9, 0x9a, 0x85, 0xdf, 0x4a, 0x2b, 0x4b, 0x82, 0x09,
			0x4f, 0xa6, 0x35, 0xb9, 0x4b, 0xb4, 0x05, 0x51, 0xf2, 0xc4, 0x09, 0xad, 0x0e
		])
	);
});

test("bigIntFromTwosComplementBytes()", () => {
	expect(bigIntFromTwosComplementBytes(new Uint8Array([0x00]))).toBe(0n);

	expect(bigIntFromTwosComplementBytes(new Uint8Array([0x01]))).toBe(1n);
	expect(bigIntFromTwosComplementBytes(new Uint8Array([0x7f]))).toBe(127n);
	expect(bigIntFromTwosComplementBytes(new Uint8Array([0x00, 0x80]))).toBe(128n);
	expect(
		bigIntFromTwosComplementBytes(
			new Uint8Array([
				0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
				0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
			])
		)
	).toBe(5476057457410545405175640567415649081748931656501235026509713265394n);

	expect(bigIntFromTwosComplementBytes(new Uint8Array([0xff]))).toBe(-1n);
	expect(bigIntFromTwosComplementBytes(new Uint8Array([0x80]))).toBe(-128n);
	expect(bigIntFromTwosComplementBytes(new Uint8Array([0xff, 0x7f]))).toBe(-129n);
	expect(
		bigIntFromTwosComplementBytes(
			new Uint8Array([
				0xcc, 0x00, 0x71, 0x13, 0xf8, 0x63, 0xb9, 0x9a, 0x85, 0xdf, 0x4a, 0x2b, 0x4b, 0x82, 0x09,
				0x4f, 0xa6, 0x35, 0xb9, 0x4b, 0xb4, 0x05, 0x51, 0xf2, 0xc4, 0x09, 0xad, 0x0e
			])
		)
	).toBe(-5476057457410545405175640567415649081748931656501235026509713265394n);
});

test("variableLengthQuantityBytes()", () => {
	expect(variableLengthQuantityBytes(1n)).toStrictEqual(new Uint8Array([0x01]));
	expect(variableLengthQuantityBytes(0x7fn)).toStrictEqual(new Uint8Array([0x7f]));
	expect(variableLengthQuantityBytes(0xffn)).toStrictEqual(new Uint8Array([0x81, 0x7f]));
	expect(variableLengthQuantityBytes(0xffffn)).toStrictEqual(new Uint8Array([0x83, 0xff, 0x7f]));
});

test("variableLengthQuantityFromBytes()", () => {
	expect(variableLengthQuantityFromBytes(new Uint8Array([0x01]), 10)).toStrictEqual([1n, 1]);
	expect(variableLengthQuantityFromBytes(new Uint8Array([0x7f]), 10)).toStrictEqual([0x7fn, 1]);
	expect(variableLengthQuantityFromBytes(new Uint8Array([0x81, 0x7f]), 10)).toStrictEqual([
		0xffn,
		2
	]);
	expect(variableLengthQuantityFromBytes(new Uint8Array([0x83, 0xff, 0x7f]), 10)).toStrictEqual([
		0xffffn,
		3
	]);
	expect(
		variableLengthQuantityFromBytes(new Uint8Array([0x83, 0xff, 0x7f, 0x00]), 10)
	).toStrictEqual([0xffffn, 3]);
	expect(() => variableLengthQuantityFromBytes(new Uint8Array([0x83, 0xff]), 10)).toThrowError();
});
