---
title: "ASN1PrintableString"
---

# ASN1PrintableString

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 printable string value.

## Constructor

```ts
function constructor(value: Uint8Array): this;
```

### Parameters

- `value`

### Methods

- [`decodeText()`](/reference/main/ASN1PrintableString/decodeText)
- [`encodeContents()`](/reference/main/ASN1PrintableString/encodeContents)

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
