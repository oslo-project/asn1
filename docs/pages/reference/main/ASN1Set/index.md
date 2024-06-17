---
title: "ASN1Set"
---

# ASN1Set

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 set and set-of value. While this implements `ASN1Encodable`, we recommend using [`ASN1EncodableSet`](/reference/main/ASN1EncodableSet) for encoding sets instead since it represents sequence as an array of [`ASN1Encodable`](/reference/main/ASN1Encodable).

**This does not automatically sort the elements as required by DER when encoding the value.**

## Constructor

```ts
//$ ASN1Value=/reference/main/ASN1Value
function constructor(elements: $$ASN1Value[]): this;
```

### Parameters

- `elements`

### Methods

- [`contents()`](/reference/main/ASN1Set/contents)
- [`isSetOfSingleType.md()`](/reference/main/ASN1Set/isSetOfSingleType.md)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
//$ ASN1Value=/reference/main/ASN1Value
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
	elements: $$ASN1Value[];
}
```

- `class`
- `type`
- `tag`
- `elements`
