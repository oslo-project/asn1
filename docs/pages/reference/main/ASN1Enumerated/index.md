---
title: "ASN1Enumerated"
---

# ASN1Enumerated

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 enumerated value.

## Constructor

```ts
function constructor(value: bigint): this;
```

### Parameters

- `value`

### Methods

- [`encodeContents()`](/reference/main/ASN1Enumerated/encodeContents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	tag: number;
	value: bigint;
}
```

- `class`
- `type`
- `tag`
- `value`
