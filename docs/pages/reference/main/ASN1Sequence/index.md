---
title: "ASN1Sequence"
---

# ASN1Sequence

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 sequence and sequence-of value. While this implements `ASN1Encodable`, we recommend using [`ASN1EncodableSequence`](/reference/main/ASN1EncodableSequence) for encoding sequences instead since it represents sequence as an array of [`ASN1Encodable`](/reference/main/ASN1Encodable).

## Constructor

```ts
//$ ASN1Value=/reference/main/ASN1Value
function constructor(elements: $$ASN1Value[]): this;
```

### Parameters

- `elements`

### Methods

- [`contents()`](/reference/main/ASN1Sequence/contents)
- [`isSequenceOfSingleType()`](/reference/main/ASN1Sequence/isSequenceOfSingleType)

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
