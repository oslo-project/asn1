---
title: "ASN1UTCTime"
---

# ASN1UTCTime

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

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

- [`encodeContents()`](/reference/main/ASN1UTCTime/encodeContents)
- [`toDate()`](/reference/main/ASN1UTCTime/toDate)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
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
