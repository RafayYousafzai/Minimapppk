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
import { MapPin, Building, Globe, Home, Mail } from "lucide-react";

interface ShippingDetailsFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

const ShippingDetailsForm: React.FC<ShippingDetailsFormProps> = ({ form }) => {
  return (
    <div className="space-y-8 mt-8">
      {/* Header Section */}
      {/* <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Shipping Details</h2>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Tell us where to send your amazing products! We'll make sure they
          arrive safely. 📦✨
        </p>
      </div> */}

      <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 rounded-2xl p-6 md:p-8 shadow-lg">
        {/* Personal Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Home className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="shippingFirstName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    First name *<span className="text-purple-500">💜</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane"
                      {...field}
                      value={field.value ?? ""}
                      className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-6 text-lg transition-all duration-300 hover:border-purple-300"
                    />
                  </FormControl>
                  <FormMessage className="text-pink-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingLastName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Last name *<span className="text-pink-500">💖</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      value={field.value ?? ""}
                      className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-6 text-lg transition-all duration-300 hover:border-purple-300"
                    />
                  </FormControl>
                  <FormMessage className="text-pink-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shippingCompanyName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-500" />
                  Company name (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Acme Corp"
                    {...field}
                    value={field.value ?? ""}
                    className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-6 text-lg transition-all duration-300 hover:border-purple-300"
                  />
                </FormControl>
                <FormMessage className="text-pink-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Address Information */}
        <div className="space-y-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Address Information
            </h3>
          </div>

          <FormField
            control={form.control}
            name="shippingCountry"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-500" />
                  Country / Region *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? "PK"}
                >
                  <FormControl>
                    <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-6 text-lg transition-all duration-300 hover:border-purple-300">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-2 border-purple-200">
                    {countries.map((country) => (
                      <SelectItem
                        key={country.value}
                        value={country.value}
                        className="rounded-lg hover:bg-purple-50 focus:bg-purple-50"
                      >
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-pink-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingStreetAddress1"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Home className="w-4 h-4 text-purple-500" />
                  Street address *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="House number and street name"
                    {...field}
                    value={field.value ?? ""}
                    className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-6 text-lg transition-all duration-300 hover:border-purple-300"
                  />
                </FormControl>
                <FormMessage className="text-pink-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingStreetAddress2"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-500" />
                  Apartment, suite, unit, etc. (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Apartment, suite, unit, etc."
                    {...field}
                    value={field.value ?? ""}
                    className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-6 text-lg transition-all duration-300 hover:border-purple-300"
                  />
                </FormControl>
                <FormMessage className="text-pink-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="shippingCity"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    Town / City *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lahore"
                      {...field}
                      value={field.value ?? ""}
                      className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-6 text-lg transition-all duration-300 hover:border-purple-300"
                    />
                  </FormControl>
                  <FormMessage className="text-pink-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingState"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-500" />
                    State / County *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? "Punjab"}
                  >
                    <FormControl>
                      <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-6 text-lg transition-all duration-300 hover:border-purple-300">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-2 border-purple-200">
                      {pakistanStates.map((state) => (
                        <SelectItem
                          key={state}
                          value={state}
                          className="rounded-lg hover:bg-purple-50 focus:bg-purple-50"
                        >
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-pink-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shippingPostcode"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  Postcode / ZIP *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="54000"
                    {...field}
                    value={field.value ?? ""}
                    className="border-2 border-purple-200 focus:border-purple-400 rounded-xl py-6 text-lg transition-all duration-300 hover:border-purple-300"
                  />
                </FormControl>
                <FormMessage className="text-pink-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 text-purple-700">
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🔒</span>
            </div>
            <p className="text-sm font-medium">
              Your information is secure and encrypted. We never share your
              details with third parties. 💜
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetailsForm;
