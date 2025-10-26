import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mars, Venus } from "lucide-react";
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRegisterStore, type Gender } from "@/store/registerStore";

interface Props {}

const RegisterFormStep1: React.FC<Props> = () => {
  const { isLoading, formData, errors, setFormData, setErrors, setCurrentStep } =
    useRegisterStore();

  const handleInputChange = (field: string, value: string) => {
    setFormData({ [field]: value });
    if (errors[field as keyof typeof errors])
      setErrors({ ...errors, [field as keyof typeof errors]: undefined });
  };

  const handleGenderSelect = (gender: Gender) => {
    setFormData({ gender });
    if (errors.gender) setErrors({ ...errors, gender: undefined });
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
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) setCurrentStep(2);
  };

  return (
    <>
      {/* <CardHeader className="space-y-4 text-center pb-6">
        <div>
          <CardTitle className="text-xl text-gray-800">Create Your Account</CardTitle>
          <CardDescription className="text-gray-600">
            Let's start with your basic information
          </CardDescription>
        </div>
      </CardHeader> */}

      <div className="space-y-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-gray-700 font-medium flex flex-col items-start space-y-1"
          >
            <span>First Name</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${
              errors.firstName ? "border-red-500" : ""
            }`}
            autoComplete="given-name"
          />
          {errors.firstName && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.firstName}</span>
            </div>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-gray-700 font-medium flex flex-col items-start space-y-1"
          >
            <span>Last Name</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${
              errors.lastName ? "border-red-500" : ""
            }`}
            autoComplete="family-name"
          />
          {errors.lastName && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.lastName}</span>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-gray-700 font-medium flex flex-col items-start space-y-1"
          >
            <span>Email Address</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value.toLowerCase())}
            className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${
              errors.email ? "border-red-500" : ""
            }`}
            autoComplete="email"
          />
          {errors.email && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.email}</span>
            </div>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium flex flex-col items-start space-y-1">
            <span>Gender</span>
          </Label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleGenderSelect("Male")}
              className={`flex-1 flex items-center justify-center space-x-2 h-12 rounded-lg border-2 transition-all ${
                formData.gender === "Male"
                  ? "bg-greenery-500 text-white border-greenery-500"
                  : "border-gray-300 text-gray-700 hover:border-greenery-300 hover:bg-greenery-50"
              }`}
            >
              <Mars className="w-5 h-5" />
              <span>Male</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenderSelect("Female")}
              className={`flex-1 flex items-center justify-center space-x-2 h-12 rounded-lg border-2 transition-all ${
                formData.gender === "Female"
                  ? "bg-pink-500 text-white border-pink-500"
                  : "border-gray-300 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <Venus className="w-5 h-5" />
              <span>Female</span>
            </button>
          </div>
          {errors.gender && (
            <div className="flex items-center space-x-1 text-red-600 mt-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.gender}</span>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
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
