"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ShippingAddress } from "@/lib/checkout"

interface ShippingFormProps {
  shippingAddress: ShippingAddress
  onAddressChange: (address: ShippingAddress) => void
}

export function ShippingForm({ shippingAddress, onAddressChange }: ShippingFormProps) {
  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    onAddressChange({
      ...shippingAddress,
      [field]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Shipping Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              className="h-10 sm:h-11"
              value={shippingAddress.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              className="h-10 sm:h-11"
              value={shippingAddress.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            className="h-10 sm:h-11"
            value={shippingAddress.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            className="h-10 sm:h-11"
            value={shippingAddress.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address
          </Label>
          <Input
            id="address"
            className="h-10 sm:h-11"
            value={shippingAddress.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Street address, apartment, suite, etc."
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
           {/*<div className="space-y-2 sm:col-span-1 lg:col-span-1">
            <Label htmlFor="city" className="text-sm font-medium">
              Area
            </Label>
            <Input
              id="area"
              className="h-10 sm:h-11"
              value={shippingAddress.city}
              onChange={(e) => handleInputChange("area", e.target.value)}
              required
            />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="area" className="text-sm font-medium">
             Area
            </Label>
            <Select value={shippingAddress.area} onValueChange={(value) => handleInputChange("area", value)}>
              <SelectTrigger className="h-10 sm:h-11">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CA">Shivaji Nagar</SelectItem>
                <SelectItem value="NY">Vazirabad</SelectItem>
                <SelectItem value="TX">Iti corner</SelectItem>
                <SelectItem value="FL">Chhatripati chowk</SelectItem>
                <SelectItem value="IL">Kavtha</SelectItem>
                <SelectItem value="PA">Vishnupuri</SelectItem>
                <SelectItem value="OH">Juna Mondha</SelectItem>
                <SelectItem value="GA">Nava Mondha</SelectItem>
                <SelectItem value="NC">Raj Corner</SelectItem>
                <SelectItem value="MI">Air port Area</SelectItem>
                <SelectItem value="MI">Kala Mandir</SelectItem>
                <SelectItem value="MI">Taroda Naka</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="zipCode" className="text-sm font-medium">
              ZIP Code
            </Label>
            <Input
              id="zipCode"
              className="h-10 sm:h-11"
              value={shippingAddress.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              required
            />
          </div>*/}
        </div> 

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium">
            City
          </Label>
          <Select value={shippingAddress.city} onValueChange={(value) => handleInputChange("city", value)}>
            <SelectTrigger className="h-10 sm:h-11">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">Nanded</SelectItem>
              <SelectItem value="CA">Outside Nanded</SelectItem>
              
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
