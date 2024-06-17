---
title: "ASN1UTCTime"
---

# ASN1UTCTime

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 UTC time value.

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

- `year`: The year in 2 digits
- `month`: Unlike `Date`, this must is **one-based** (e.g. January is 1)
- `date`
- `hours`:
- `minutes`
- `seconds`

### Methods

- [`contents()`](/reference/main/ASN1UTCTime/contents)
- [`toDate()`](/reference/main/ASN1UTCTime/toDate)

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
}
```

- `class`
- `type`
- `tag`
- `year`: The year in 2 digits
- `month`: Unlike `Date`, this must is **one-based** (e.g. January is 1)
- `date`
- `hours`:
- `minutes`
- `seconds`
