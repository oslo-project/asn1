import { expect, test } from "vitest";
import {
	variableUintToBytesBigEndian,
	variableIntToBytesBigEndian,
	toVariableUint,
	toVariableInt,
	variableLengthQuantityBigEndian,
	toVariableLengthQuantityBigEndian
} from "./integer.js";

test("variableUintToBytesBigEndian()", () => {
	expect(variableUintToBytesBigEndian(1n)).toStrictEqual(new Uint8Array([0x01]));
	expect(variableUintToBytesBigEndian(255n)).toStrictEqual(new Uint8Array([0xff]));
	expect(variableUintToBytesBigEndian(256n)).toStrictEqual(new Uint8Array([0x01, 0x00]));
	expect(
		variableUintToBytesBigEndian(
			5476057457410545405175640567415649081748931656501235026509713265394n
		)
	).toStrictEqual(
		new Uint8Array([
			0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
			0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
		])
	);
});

test("variableIntToBytesBigEndian()", () => {
	expect(variableIntToBytesBigEndian(0n)).toStrictEqual(new Uint8Array([0x00]));

	expect(variableIntToBytesBigEndian(1n)).toStrictEqual(new Uint8Array([0x01]));
	expect(variableIntToBytesBigEndian(127n)).toStrictEqual(new Uint8Array([0x7f]));
	expect(variableIntToBytesBigEndian(128n)).toStrictEqual(new Uint8Array([0x00, 0x80]));
	expect(
		variableUintToBytesBigEndian(
			5476057457410545405175640567415649081748931656501235026509713265394n
		)
	).toStrictEqual(
		new Uint8Array([
			0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
			0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
		])
	);

	expect(variableIntToBytesBigEndian(-1n)).toStrictEqual(new Uint8Array([0xff]));
	expect(variableIntToBytesBigEndian(-128n)).toStrictEqual(new Uint8Array([0x80]));
	expect(variableIntToBytesBigEndian(-129n)).toStrictEqual(new Uint8Array([0xff, 0x7f]));
	expect(
		variableIntToBytesBigEndian(
			-5476057457410545405175640567415649081748931656501235026509713265394n
		)
	).toStrictEqual(
		new Uint8Array([
			0xcc, 0x00, 0x71, 0x13, 0xf8, 0x63, 0xb9, 0x9a, 0x85, 0xdf, 0x4a, 0x2b, 0x4b, 0x82, 0x09,
			0x4f, 0xa6, 0x35, 0xb9, 0x4b, 0xb4, 0x05, 0x51, 0xf2, 0xc4, 0x09, 0xad, 0x0e
		])
	);
});

test("toVariableUint()", () => {
	expect(toVariableUint(new Uint8Array([0x01]))).toBe(1n);
	expect(toVariableUint(new Uint8Array([0xff]))).toBe(255n);
	expect(toVariableUint(new Uint8Array([0x01, 0x00]))).toBe(256n);
	expect(
		toVariableUint(
			new Uint8Array([
				0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
				0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
			])
		)
	).toBe(5476057457410545405175640567415649081748931656501235026509713265394n);
});

test("toVariableInt()", () => {
	expect(toVariableInt(new Uint8Array([0x00]))).toBe(0n);

	expect(toVariableInt(new Uint8Array([0x01]))).toBe(1n);
	expect(toVariableInt(new Uint8Array([0x7f]))).toBe(127n);
	expect(toVariableInt(new Uint8Array([0x00, 0x80]))).toBe(128n);
	expect(
		toVariableInt(
			new Uint8Array([
				0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
				0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
			])
		)
	).toBe(5476057457410545405175640567415649081748931656501235026509713265394n);

	expect(toVariableInt(new Uint8Array([0xff]))).toBe(-1n);
	expect(toVariableInt(new Uint8Array([0x80]))).toBe(-128n);
	expect(toVariableInt(new Uint8Array([0xff, 0x7f]))).toBe(-129n);
	expect(
		toVariableInt(
			new Uint8Array([
				0xcc, 0x00, 0x71, 0x13, 0xf8, 0x63, 0xb9, 0x9a, 0x85, 0xdf, 0x4a, 0x2b, 0x4b, 0x82, 0x09,
				0x4f, 0xa6, 0x35, 0xb9, 0x4b, 0xb4, 0x05, 0x51, 0xf2, 0xc4, 0x09, 0xad, 0x0e
			])
		)
	).toBe(-5476057457410545405175640567415649081748931656501235026509713265394n);
});

test("toVariableLengthQuantityBigEndian()", () => {
	expect(variableLengthQuantityBigEndian(1n)).toStrictEqual(new Uint8Array([0x01]));
	expect(variableLengthQuantityBigEndian(0x7fn)).toStrictEqual(new Uint8Array([0x7f]));
	expect(variableLengthQuantityBigEndian(0xffn)).toStrictEqual(new Uint8Array([0x81, 0x7f]));
	expect(variableLengthQuantityBigEndian(0xffffn)).toStrictEqual(
		new Uint8Array([0x83, 0xff, 0x7f])
	);
});

test("toVariableLengthQuantityBigEndian()", () => {
	expect(toVariableLengthQuantityBigEndian(new Uint8Array([0x01]))).toStrictEqual([1n, 1]);
	expect(toVariableLengthQuantityBigEndian(new Uint8Array([0x7f]))).toStrictEqual([0x7fn, 1]);
	expect(toVariableLengthQuantityBigEndian(new Uint8Array([0x81, 0x7f]))).toStrictEqual([0xffn, 2]);
	expect(toVariableLengthQuantityBigEndian(new Uint8Array([0x83, 0xff, 0x7f]))).toStrictEqual([0xffffn, 3]);
	expect(toVariableLengthQuantityBigEndian(new Uint8Array([0x83, 0xff, 0x7f, 0x00]))).toStrictEqual([
		0xffffn,
		3
	]);
	expect(() => toVariableLengthQuantityBigEndian(new Uint8Array([0x83, 0xff]))).toThrowError();
});
