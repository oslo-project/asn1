---
title: "ASN1Set"
---

# ASN1Set

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 set and set-of value.

**This does not automatically sort the items as required by DER when encoding the value.**

## Constructor

```ts
//$ ASN1Value=/reference/main/ASN1Value
function constructor(items: $$ASN1Value[]): this;
```

### Parameters

- `items`

### Methods

- [`encodeContents()`](/reference/main/ASN1Set/encodeContents)
- [`isSetOfSingleType.md()`](/reference/main/ASN1Set/isSetOfSingleType.md)

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
