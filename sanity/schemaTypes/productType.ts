import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Sofa Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (Permanent ID)",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Tagline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "price",
      title: "Display Price",
      type: "string",
      description: "e.g. ₹78,000",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "priceNum",
      title: "Numeric Price",
      type: "number",
      description: "e.g. 78000 (used for cart calculations)",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      description: "e.g. W 84 × D 38 × H 30 in",
    }),
    defineField({
      name: "configurations",
      title: "Available Configurations",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "fabrics",
      title: "Fabric Options",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "colors",
      title: "Colour Options",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "mainImage",
      title: "Main / Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      description: "Multiple angle lifestyle shots and close-up detail photos",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price",
      media: "mainImage",
    },
  },
});
