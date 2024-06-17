---
title: "ASN1GeneralizedTime"
---

# ASN1GeneralizedTime

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 generalized time value.

## Constructor

```ts
function constructor(
	year: number,
	month: number,
	date: number,
	hours: number,
	minutes: number,
	seconds: number,
	milliseconds: number
): this;
```

### Parameters

- `year`
- `month`: Unlike `Date`, this must is **one-based** (e.g. January is 1)
- `date`
- `hours`:
- `minutes`
- `seconds`
- `milliseconds`

### Methods

- [`contents()`](/reference/main/ASN1GeneralizedTime/contents)
- [`toDate()`](/reference/main/ASN1GeneralizedTime/toDate)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
	year: number;
	month: number;
	date: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}
```

- `class`
- `type`
- `tag`
- `year`
- `month`: Unlike `Date`, this must is **one-based** (e.g. January is 1)
- `date`
- `hours`:
- `minutes`
- `seconds`
- `milliseconds`
