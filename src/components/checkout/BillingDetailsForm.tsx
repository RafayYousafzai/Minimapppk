"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CheckoutFormData } from "@/lib/checkoutTypes";
import { pakistanStates, countries } from "@/lib/checkoutTypes";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BillingDetailsFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

const BillingDetailsForm: React.FC<BillingDetailsFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Billing details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="billingFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name *</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billingLastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name *</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="billingCompanyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company name (optional)</FormLabel>
            <FormControl>
              <Input placeholder="Acme Corp" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="billingCountry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country / Region *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="billingStreetAddress1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street address *</FormLabel>
            <FormControl>
              <Input placeholder="House number and street name" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="billingStreetAddress2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apartment, suite, unit, etc. (optional)</FormLabel>
            <FormControl>
              <Input placeholder="Apartment, suite, unit, etc." {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="billingCity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Town / City *</FormLabel>
            <FormControl>
              <Input placeholder="Karachi" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="billingState"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State / County *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {pakistanStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="billingPostcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postcode / ZIP *</FormLabel>
            <FormControl>
              <Input placeholder="75500" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="billingPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone *</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="+92 300 1234567" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="billingEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email address *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john.doe@example.com" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BillingDetailsForm;
