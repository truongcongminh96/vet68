import { z } from "zod";

export const productFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Tên sản phẩm cần ít nhất 2 ký tự.").max(220),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch nối."),
  sku: z.string().trim().min(2).max(80),
  shortDescription: z.string().trim().max(500).optional(),
  description: z.string().trim().optional(),
  companyId: z.string().uuid("Cần chọn công ty phân phối."),
  brandId: z.string().uuid().or(z.literal("")),
  categoryId: z.string().uuid().or(z.literal("")),
  animalTypeIds: z.array(z.string().uuid()),
  treatmentCategoryIds: z.array(z.string().uuid()),
  referencePrice: z.union([z.number().positive(), z.literal("")]).optional(),
  priceDisplayMode: z.enum(["fixed", "approximate", "contact"]),
  priceNote: z.string().trim().max(300).optional(),
  unit: z.string().trim().max(80).optional(),
  dosageForm: z.string().trim().max(120).optional(),
  activeIngredients: z.string().trim().optional(),
  packaging: z.string().trim().max(220).optional(),
  indications: z.string().trim().optional(),
  usageInformation: z.string().trim().optional(),
  storageInformation: z.string().trim().optional(),
  safetyInformation: z.string().trim().optional(),
  requiresConsultation: z.boolean(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isActive: z.boolean(),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(170).optional(),
}).superRefine((value, context) => {
  if (value.priceDisplayMode !== "contact" && (value.referencePrice === "" || value.referencePrice === undefined)) context.addIssue({ code: "custom", path: ["referencePrice"], message: "Chế độ giá này cần một mức giá tham khảo." });
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
