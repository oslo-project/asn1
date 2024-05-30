import { test, expect } from "vitest";
import { encodeObjectIdentifier } from "./asn1.js";

test("encodeObjectIdentifier()", () => {
	expect(encodeObjectIdentifier([2, 100, 3])).toStrictEqual(new Uint8Array([0x81, 0x34, 0x03]));
});
