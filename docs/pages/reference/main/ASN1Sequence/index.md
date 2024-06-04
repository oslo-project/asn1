---
title: "ASN1Sequence"
---

# ASN1Sequence

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 sequence and sequence-of value.

## Constructor

```ts
//$ ASN1Value=/reference/main/ASN1Value
function constructor(items: $$ASN1Value[]): this;
```

### Parameters

- `items`

### Methods

- [`encodeContents()`](/reference/main/ASN1Sequence/encodeContents)
- [`isSequenceOfSingleType()`](/reference/main/ASN1Sequence/isSequenceOfSingleType)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
//$ ASN1Value=/reference/main/ASN1Value
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	tag: number;
	items: $$ASN1Value[];
}
```

- `class`
- `type`
- `tag`
- `items`
