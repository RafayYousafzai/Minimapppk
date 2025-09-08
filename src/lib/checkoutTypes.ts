
import { z } from 'zod';

export const pakistanStates = [
  "Azad Kashmir",
  "Balochistan",
  "Gilgit-Baltistan",
  "Islamabad Capital Territory",
  "Khyber Pakhtunkhwa",
  "Punjab",
  "Sindh",
];

export const countries = [
  { value: "PK", label: "Pakistan" },
  // Add more countries if needed for future expansion
];

export const checkoutFormSchema = z.object({
  // Billing Details
  billingFirstName: z.string().min(1, "First name is required"),
  billingLastName: z.string().min(1, "Last name is required"),
  billingCompanyName: z.string().optional(),
  billingCountry: z.string().min(1, "Country is required").default("PK"),
  billingStreetAddress1: z.string().min(1, "Street address is required"),
  billingStreetAddress2: z.string().optional(),
  billingCity: z.string().min(1, "Town / City is required"),
  billingState: z.string().min(1, "State / County is required").default("Sindh"),
  billingPostcode: z.string().min(1, "Postcode / ZIP is required"),
  billingPhone: z.string().min(1, "Phone is required").regex(/^\+?[0-9\s-()]{7,20}$/, "Invalid phone number format"),
  billingEmail: z.string().email("Invalid email address"),

  // Shipping Details
  shipToDifferentAddress: z.boolean().default(false),
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingCompanyName: z.string().optional(),
  shippingCountry: z.string().optional().default("PK"),
  shippingStreetAddress1: z.string().optional(),
  shippingStreetAddress2: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional().default("Sindh"),
  shippingPostcode: z.string().optional(),
  
  // Order Notes
  orderNotes: z.string().optional(),

  // Terms
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must read and agree to the website terms and conditions.",
  }),
}).superRefine((data, ctx) => {
  if (data.shipToDifferentAddress) {
    if (!data.shippingFirstName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shipping first name is required", path: ["shippingFirstName"] });
    }
    if (!data.shippingLastName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shipping last name is required", path: ["shippingLastName"] });
    }
    if (!data.shippingStreetAddress1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shipping street address is required", path: ["shippingStreetAddress1"] });
    }
    if (!data.shippingCity) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shipping town / city is required", path: ["shippingCity"] });
    }
    if (!data.shippingState) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shipping state / county is required", path: ["shippingState"] });
    }
    if (!data.shippingPostcode) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shipping postcode / ZIP is required", path: ["shippingPostcode"] });
    }
    if (!data.shippingCountry) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shipping country is required", path: ["shippingCountry"] });
    }
  }
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
