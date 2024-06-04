---
title: "ASN1IA5String"
---

# ASN1IA5String

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 IA5 string (ASCII) value.

## Constructor

```ts
function constructor(value: Uint8Array): this;
```

### Parameters

- `value`

### Methods

- [`decodeText()`](/reference/main/ASN1IA5String/decodeText)
- [`encodeContents()`](/reference/main/ASN1IA5String/encodeContents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	tag: number;
	value: Uint8Array;
}
```

- `class`
- `type`
- `tag`
- `value`
