---
title: "ASN1EncodableSet"
---

# ASN1EncodableSet

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 set and set-of value. Unlike [`ASN1Set`](/reference/main/ASN1Set), this is represented as an array of [`ASN1Encodable`](/reference/main/ASN1Encodable) instead of [`ASN1Value`](/reference/main/ASN1Value), which makes it friendlier to use when encoding.

**This does not automatically sort the elements as required by DER when encoding the value.**

## Constructor

```ts
//$ ASN1Encodable=/reference/main/ASN1Value
function constructor(elements: $$ASN1Encodable[]): this;
```

### Parameters

- `elements`

### Methods

- [`contents()`](/reference/main/ASN1Set/contents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
//$ ASN1Encodable=/reference/main/ASN1Encodable
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
	elements: $$ASN1Encodable[];
}
```

- `class`
- `type`
- `tag`
- `elements`
