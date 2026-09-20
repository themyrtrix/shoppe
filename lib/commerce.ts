export const shippingRates = {
  STANDARD: 0,
  EXPRESS: 15000,
} as const;

export function getVariantPrice(variant: { priceCents: number | null; product: { priceCents: number } }) {
  return variant.priceCents ?? variant.product.priceCents;
}
