---
title: "ASN1EncodedContents"
---

# ASN1EncodedContents

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 value with encoded contents.

## Constructor

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
function constructor(
	asn1Class: $$ASN1Class,
	type: $$ASN1EncodingType,
	tag: number,
	contents: Uint8Array
): this;
```

### Parameters

- `asn1Class`
- `type`
- `tag`
- `contents`

### Methods

- [`encodeContents()`](/reference/main/ASN1Boolean/encodeContents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	tag: number;
	contents: Uint8Array;
}
```

- `class`
- `type`
- `tag`
- `contents`
