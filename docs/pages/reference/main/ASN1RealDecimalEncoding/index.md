---
title: "ASN1RealDecimalEncoding"
---

# ASN1RealDecimalEncoding

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 real value with decimal encoding.

## Constructor

```ts
//$ RealDecimalEncodingFormat=/reference/main/RealDecimalEncodingFormat
function constructor(encodingFormat: $$RealDecimalEncodingFormat, value: Uint8Array): this;
```

### Parameters

- `encodingFormat`
- `value`

### Methods

- [`encodeContents()`](/reference/main/ASN1RealDecimalEncoding/encodeContents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
//$ RealDecimalEncodingFormat=/reference/main/RealDecimalEncodingFormat
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	encodingFormat: $$RealDecimalEncodingFormat;
	value: Uint8Array;
}
```

- `class`
- `type`
- `tag`
- `value`
