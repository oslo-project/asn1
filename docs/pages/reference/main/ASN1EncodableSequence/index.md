---
title: "ASN1EncodableSequence"
---

# ASN1EncodableSequence

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 sequence and sequence-of value. Unlike [`ASN1Sequence`](/reference/main/ASN1Sequence), this is represented as an array of [`ASN1Encodable`](/reference/main/ASN1Encodable) instead of [`ASN1Value`](/reference/main/ASN1Value), which makes it friendlier to use when encoding.

## Constructor

```ts
//$ ASN1Encodable=/reference/main/ASN1Value
function constructor(elements: $$ASN1Encodable[]): this;
```

### Parameters

- `elements`

### Methods

- [`contents()`](/reference/main/ASN1EncodableSequence/contents)

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

## Example

```ts
import { ASN1EncodableSequence, ASN1Integer } from "@oslojs/asn1";

const sequence = new ASN1EncodableSequence([
	new ASN1Integer(1n),
	new ASN1Integer(10n),
	new ASN1Integer(100n)
]);
```
