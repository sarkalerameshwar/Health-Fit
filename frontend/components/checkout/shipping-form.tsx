"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ShippingAddress } from "@/lib/checkout";

interface ShippingFormProps {
  shippingAddress: ShippingAddress;
  onAddressChange: (address: ShippingAddress) => void;
}

export function ShippingForm({ shippingAddress, onAddressChange }: ShippingFormProps) {
  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    const updated: ShippingAddress = {
      ...shippingAddress,
      [field]: value,
    };
    onAddressChange(updated);

    // Persist to localStorage on every change
    localStorage.setItem("healthfit-shipping", JSON.stringify(updated));
  };

  // Default city
  const cityValue = shippingAddress.city || "Nanded";

  return (
    <Card id="shipping-form">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Shipping Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address
          </Label>
          <Input
            id="address"
            className="h-10 sm:h-11"
            value={shippingAddress.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Street address, apartment, suite, etc."
            required
          />
        </div>

        {/* Confirm Address */}
        <div className="space-y-2">
          <Label htmlFor="confirmAddress" className="text-sm font-medium">
            Confirm Address
          </Label>
          <Input
            id="confirmAddress"
            className="h-10 sm:h-11"
            value={shippingAddress.confirmAddress || ""}
            onChange={(e) => handleInputChange("confirmAddress", e.target.value)}
            placeholder="Re-enter address to confirm"
            required
          />
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-sm font-medium">
            Area / Locality
          </Label>
          <Input
            id="area"
            className="h-10 sm:h-11"
            value={shippingAddress.area || ""}
            onChange={(e) => handleInputChange("area", e.target.value)}
            placeholder="Area / Locality"
            required
          />
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobileNumber" className="text-sm font-medium">
            Mobile Number
          </Label>
          <Input
            id="mobileNumber"
            type="tel"
            className="h-10 sm:h-11"
            value={shippingAddress.mobileNumber || ""}
            onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
            required
          />
        </div>

        {/* Alternate Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="alternateNumber" className="text-sm font-medium">
            Alternate Mobile Number (Optional)
          </Label>
          <Input
            id="alternateNumber"
            type="tel"
            className="h-10 sm:h-11"
            value={shippingAddress.alternateNumber || ""}
            onChange={(e) => handleInputChange("alternateNumber", e.target.value)}
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City
          </Label>
          <Input
            id="city"
            className="h-10 sm:h-11"
            value={cityValue}
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  );
}
