
"use client";

import type React from "react";
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
import { MapPin, Building, Globe, Home, Mail, Truck } from "lucide-react";

interface ShippingDetailsFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

const ShippingDetailsForm: React.FC<ShippingDetailsFormProps> = ({ form }) => {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Shipping Details</h3>
        </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="shippingFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jane"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shippingLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shippingCompanyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                Company name (optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Corp"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Address Information */}
      <div className="space-y-6 mt-8">
        <FormField
          control={form.control}
          name="shippingCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Country / Region *
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? "PK"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.value}
                      value={country.value}
                    >
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
          name="shippingStreetAddress1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Home className="w-4 h-4 text-muted-foreground" />
                Street address *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="House number and street name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shippingStreetAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                Apartment, suite, unit, etc. (optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Apartment, suite, unit, etc."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="shippingCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Town / City *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Lahore"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingState"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  State / County *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? "Punjab"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pakistanStates.map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shippingPostcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Postcode / ZIP *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="54000"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ShippingDetailsForm;
