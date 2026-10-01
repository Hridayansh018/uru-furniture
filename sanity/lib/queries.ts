// GROQ queries for URU Furniture products in Sanity CMS

export const PRODUCTS_QUERY = `*[_type == "product"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  subtitle,
  description,
  price,
  priceNum,
  dimensions,
  configurations,
  fabrics,
  colors,
  "mainImageUrl": mainImage.asset->url,
  "galleryUrls": gallery[].asset->url
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  subtitle,
  description,
  price,
  priceNum,
  dimensions,
  configurations,
  fabrics,
  colors,
  "mainImageUrl": mainImage.asset->url,
  "galleryUrls": gallery[].asset->url
}`;
