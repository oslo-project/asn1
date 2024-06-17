---
title: "ASN1Integer"
---

# ASN1Integer

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 integer value.

## Constructor

```ts
function constructor(value: bigint): this;
```

### Parameters

- `value`

### Methods

- [`contents()`](/reference/main/ASN1Integer/contents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
	value: bigint;
}
```

- `class`
- `type`
- `tag`
- `value`
