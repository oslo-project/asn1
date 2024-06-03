import { test, expect } from "vitest";
import { encodeObjectIdentifier } from "./asn1.js";

test("encodeObjectIdentifier()", () => {
	expect(encodeObjectIdentifier("2.100.3")).toStrictEqual(new Uint8Array([0x81, 0x34, 0x03]));
	expect(encodeObjectIdentifier("1.2.840.10045.4.3.2")).toStrictEqual(
		new Uint8Array([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02])
	);
});
