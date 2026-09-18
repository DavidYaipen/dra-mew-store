import { describe, expect, it } from 'vitest';
import { isBinderCardSoldOut, isProductSoldOut, remainingQty } from './stock';

describe('isProductSoldOut', () => {
  it('returns true when stock is 0', () => {
    expect(isProductSoldOut({ stock: 0 })).toBe(true);
  });

  it('returns false when stock is undefined (untracked)', () => {
    expect(isProductSoldOut({ stock: undefined })).toBe(false);
  });

  it('returns false when stock is greater than 0', () => {
    expect(isProductSoldOut({ stock: 5 })).toBe(false);
  });

  it('returns true for preorder items too when stock is 0 (preorder no longer bypasses stock)', () => {
    expect(isProductSoldOut({ stock: 0 })).toBe(true);
  });
});

describe('isBinderCardSoldOut', () => {
  it('returns false when there are no listings', () => {
    expect(isBinderCardSoldOut([])).toBe(false);
  });

  it('returns false when at least one listing has stock', () => {
    expect(
      isBinderCardSoldOut([
        { stock: 0, isPreorder: false },
        { stock: 2, isPreorder: false },
      ]),
    ).toBe(false);
  });

  it('returns true when every listing is out of stock', () => {
    expect(
      isBinderCardSoldOut([
        { stock: 0, isPreorder: false },
        { stock: 0, isPreorder: false },
      ]),
    ).toBe(true);
  });

  it('returns false when an out-of-stock listing is a preorder', () => {
    expect(isBinderCardSoldOut([{ stock: 0, isPreorder: true }])).toBe(false);
  });
});

describe('remainingQty', () => {
  it('returns Infinity and no limit when neither stock nor customer limit is set', () => {
    expect(remainingQty({}, 0)).toEqual({ remaining: Infinity, limitedBy: null });
  });

  it('is limited by stock when only stock is set', () => {
    expect(remainingQty({ stock: 5 }, 2)).toEqual({ remaining: 3, limitedBy: 'stock', cap: 5 });
  });

  it('is limited by customer cap when only max_qty_per_customer is set', () => {
    expect(remainingQty({ max_qty_per_customer: 3 }, 1)).toEqual({
      remaining: 2,
      limitedBy: 'customer',
      cap: 3,
    });
  });

  it('picks the more restrictive of stock and customer cap', () => {
    expect(remainingQty({ stock: 10, max_qty_per_customer: 2 }, 0)).toEqual({
      remaining: 2,
      limitedBy: 'customer',
      cap: 2,
    });
    expect(remainingQty({ stock: 2, max_qty_per_customer: 10 }, 0)).toEqual({
      remaining: 2,
      limitedBy: 'stock',
      cap: 2,
    });
  });

  it('returns 0 remaining when already at or past the cap', () => {
    expect(remainingQty({ stock: 3 }, 3)).toEqual({ remaining: 0, limitedBy: 'stock', cap: 3 });
    expect(remainingQty({ stock: 3 }, 5)).toEqual({ remaining: 0, limitedBy: 'stock', cap: 3 });
  });
});
