---
title: "ASN1BitString"
---

# ASN1Boolean

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 boolean value.

## Constructor

```ts
function constructor(value: boolean): this;
```

### Parameters

- `value`

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
	value: boolean;
}
```

- `class`
- `type`
- `tag`
- `value`
