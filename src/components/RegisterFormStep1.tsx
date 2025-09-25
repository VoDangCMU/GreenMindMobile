import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRegisterStore } from "@/store/registerStore";

interface Props {}

const RegisterFormStep1: React.FC<Props> = () => {
  const { isLoading, formData, errors, setFormData, setErrors, setCurrentStep } = useRegisterStore();
  // ...existing code...

  const handleInputChange = (field: string, value: string) => {
    setFormData({ [field]: value });
    if (errors[field as keyof typeof errors]) setErrors({ ...errors, [field as keyof typeof errors]: undefined });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) setCurrentStep(2);
  };

  return (
    <>
      <CardHeader className="space-y-4 text-center pb-6">
        <div>
          <CardTitle className="text-xl text-gray-800">Create Your Account</CardTitle>
          <CardDescription className="text-gray-600">Let's start with your basic information</CardDescription>
        </div>
      </CardHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700 font-medium flex flex-col items-start space-y-1">
            <span>First Name</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={e => handleInputChange("firstName", e.target.value)}
            className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${errors.firstName ? "border-red-500" : ""}`}
            autoComplete="given-name"
          />
          {errors.firstName && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.firstName}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700 font-medium flex flex-col items-start space-y-1">
            <span>Last Name</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={e => handleInputChange("lastName", e.target.value)}
            className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${errors.lastName ? "border-red-500" : ""}`}
            autoComplete="family-name"
          />
          {errors.lastName && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.lastName}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium flex flex-col items-start space-y-1">
            <span>Email Address</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={e => handleInputChange("email", e.target.value.toLowerCase())}
            className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${errors.email ? "border-red-500" : ""}`}
            autoComplete="email"
          />
          {errors.email && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.email}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={isLoading}
          className="h-12 w-full bg-greenery-500 hover:bg-greenery-600 text-white font-semibold rounded"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </>
  );
};

export default RegisterFormStep1;
