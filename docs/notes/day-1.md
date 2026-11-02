# Day 1 note

## intervalsOverlap

It checks whether two time ranges share any time, using
`aStart < bEnd && bStart < aEnd`. It uses `<` and not `<=` because a booking
that ends at 10:00 and one that starts at 10:00 only touch. The artist is free
at that moment, so back-to-back bookings must be allowed. When I tried `<=`,
the "touching" test failed, which proved the difference.

## toSlotStarts

It splits a booking into 15-minute slots, so a 60-minute booking returns 4
slot start times (06:00, 06:15, 06:30, 06:45). On Day 5 each slot becomes a
database row with a unique index, so the database itself rejects a second
booking that shares a slot. That is how double booking gets prevented.

## Bugs I made today

- `date.getTime() === NaN` can never be true, because NaN is not equal to
  itself. The fix is `Number.isNaN(...)`.
- `date + minutes * 60_000` glued text together instead of adding numbers.
  The fix is `date.getTime() + ...`.
- In `isAligned` I compared milliseconds with minutes. The fix was
  converting minutes to milliseconds with `* 60_000`.
- I called `isAligned(...)` without using its result, so the guard did
  nothing. A test failed and showed me.
- My `toSlotStarts` loop used `<=` and returned one slot too many. The
  failing test showed the extra `07:00` slot.
- I wrote `expect(fn()).toThrow()` instead of `expect(() => fn()).toThrow()`,
  so the error happened before `expect` could catch it.

## What I learned

A test only has value if wrong code can make it fail. An empty test or a test
with the wrong dates passes and proves nothing.
