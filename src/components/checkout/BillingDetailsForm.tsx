
"use client"

import type React from "react"
import type { UseFormReturn } from "react-hook-form"
import type { CheckoutFormData } from "@/lib/checkoutTypes"
import { pakistanStates, countries } from "@/lib/checkoutTypes"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, MapPin, Building, Globe, Home, Mail, Phone, User } from "lucide-react"

interface BillingDetailsFormProps {
  form: UseFormReturn<CheckoutFormData>
}

const BillingDetailsForm: React.FC<BillingDetailsFormProps> = ({ form }) => {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      {/* Personal Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Billing Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="billingFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
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
            name="billingLastName"
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
          name="billingCompanyName"
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Address Information</h3>
        </div>

        <FormField
          control={form.control}
          name="billingCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Country / Region *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="billingStreetAddress1"
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
          name="billingStreetAddress2"
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
            name="billingCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Town / City *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Karachi"
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
            name="billingState"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  State / County *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="billingPostcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Postcode / ZIP *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="75500"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Contact Information */}
      <div className="space-y-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="billingPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone *
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+92 300 1234567"
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
            name="billingEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email address *
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
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
    </div>
  )
}

export default BillingDetailsForm
