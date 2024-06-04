---
title: "ASN1BitString"
---

# ASN1BitString

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 bit string value.

## Constructor

```ts
function constructor(bytes: Uint8Array, length: number): this;
```

### Parameters

- `bytes`: The bit string as bytes
- `length`: The size of the string in bits

### Methods

- [`encodeContents()`](/reference/main/ASN1BitString/encodeContents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	tag: number;
	bytes: Uint8Array;
	length: number;
}
```

- `class`
- `type`
- `tag`
- `bytes`
- `length`
