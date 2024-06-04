import { ASN1Class, ASN1EncodingType } from "./asn1.js";
import { variableLengthQuantityBigEndian, variableUintToBytesBigEndian } from "./integer.js";
import type { ASN1Value } from "./asn1.js";
import { DynamicBuffer } from "@oslojs/binary";
import { ASN1InvalidError } from "./decode.js";

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

	const buffer = new DynamicBuffer(1);

	if (asn1.tag < 0x1f) {
		firstByte |= asn1.tag;
		buffer.writeByte(firstByte);
	} else {
		firstByte |= 0x1f;
		buffer.writeByte(firstByte);
		const encodedTagNumber = variableLengthQuantityBigEndian(BigInt(asn1.tag));
		buffer.write(encodedTagNumber);
	}

	if (encodedContents.byteLength < 128) {
		buffer.writeByte(encodedContents.byteLength);
	} else {
		const encodedContentsLength = variableUintToBytesBigEndian(BigInt(encodedContents.byteLength));
		if (encodedContentsLength.byteLength > 126) {
			throw new ASN1InvalidError();
		}
		buffer.writeByte(encodedContentsLength.byteLength | 0x80);
		buffer.write(encodedContentsLength);
	}
	buffer.write(encodedContents);
	return buffer.bytes();
}
