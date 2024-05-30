import { ASN1Class, ASN1EncodingType } from "./asn1.js";
import { variableLengthQuantityBigEndian } from "./integer.js";
import type { ASN1Value } from "./asn1.js";

export function encodeASN1(asn1: ASN1Value): Uint8Array {
	const encodedContents = asn1.encodeContents();

	let firstByte = 0x00;
	if (asn1.class === ASN1Class.Universal) {
		firstByte |= 0x00;
	} else if (asn1.class === ASN1Class.Application) {
		firstByte |= 0x40;
	} else if (asn1.class === ASN1Class.ContextSpecific) {
		firstByte |= 0x80;
	} else if (asn1.class === ASN1Class.Private) {
		firstByte |= 0xc0;
	}

	if (asn1.type === ASN1EncodingType.Primitive) {
		firstByte |= 0x00;
	} else if (asn1.type === ASN1EncodingType.Constructed) {
		firstByte |= 0x20;
	}

	if (asn1.tag < 0x1f) {
		firstByte |= asn1.tag;
		const encodedContentsLength = variableLengthQuantityBigEndian(
			BigInt(encodedContents.byteLength)
		);
		const encoded = new Uint8Array(
			1 + encodedContentsLength.byteLength + encodedContents.byteLength
		);
		encoded[0] = firstByte;
		encoded.set(encodedContentsLength, 1);
		encoded.set(encodedContents, 1 + encodedContentsLength.byteLength);
		return encoded;
	}
	firstByte |= 0x1f;
	const encodedTagNumber = variableLengthQuantityBigEndian(BigInt(asn1.tag));
	const encodedContentsLength = variableLengthQuantityBigEndian(
		BigInt(encodedContents.byteLength)
	);
	const encoded = new Uint8Array(
		1 + encodedTagNumber.byteLength + encodedContentsLength.byteLength + encodedContents.byteLength
	);
	encoded[0] = firstByte;
	encoded.set(encodedTagNumber, 1);
	encoded.set(encodedContentsLength, 1 + encodedTagNumber.byteLength);
	encoded.set(encodedContents, 1 + encodedTagNumber.byteLength + encodedContentsLength.byteLength);
	return encoded;
}
