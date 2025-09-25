import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Calendar, MapPin } from "lucide-react";
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRegisterStore } from "@/store/registerStore";

interface Props {
  formData: {
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    location: string;
  };
  errors: {
    password?: string;
    confirmPassword?: string;
    dateOfBirth?: string;
    location?: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
  onChange: (field: string, value: string) => void;
  passwordStrength: { strength: number; label: string; color: string };
  locations: string[];
  isLoading: boolean;
  setErrors: (errors: any) => void;
}

const RegisterFormStep2: React.FC<Props> = ({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
  onChange,
  passwordStrength,
  locations,
  isLoading,
  setErrors,
}) => {
  const { setCurrentStep } = useRegisterStore();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = "You must be at least 13 years old";
      }
    }
    if (!formData.location) {
      newErrors.location = "Location is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) setCurrentStep(3);
  };
  const handlePrev = () => {
    setCurrentStep(1);
  };

  return (
    <>
      <CardHeader className="space-y-4 text-center pb-6">
        <div>
          <CardTitle className="text-xl text-gray-800">Secure Your Account</CardTitle>
          <CardDescription className="text-gray-600">Set up your password and profile details</CardDescription>
        </div>
      </CardHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium flex items-center space-x-1">
            <Lock className="w-4 h-4" />
            <span>Password</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={e => onChange("password", e.target.value)}
              className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 pr-12 ${errors.password ? "border-red-500" : ""}`}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={onToggleShowPassword}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-8 w-8"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Password strength</span>
                <span className={`font-medium ${
                  passwordStrength.strength <= 25
                    ? "text-red-600"
                    : passwordStrength.strength <= 50
                    ? "text-yellow-600"
                    : passwordStrength.strength <= 75
                    ? "text-blue-600"
                    : "text-green-600"
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
            </div>
          )}
          {errors.password && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.password}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={e => onChange("confirmPassword", e.target.value)}
              className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 pr-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={onToggleShowConfirmPassword}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-8 w-8"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Passwords match</span>
            </div>
          )}
          {errors.confirmPassword && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.confirmPassword}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Date of Birth</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={e => onChange("dateOfBirth", e.target.value)}
            className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${errors.dateOfBirth ? "border-red-500" : ""}`}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.dateOfBirth && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.dateOfBirth}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700 font-medium flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </Label>
          <Select value={formData.location} onValueChange={value => onChange("location", value)}>
            <SelectTrigger className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${errors.location ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.location}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={handlePrev}
          className="h-12 w-1/2 bg-gray-200 text-gray-700 font-semibold rounded"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isLoading}
          className="h-12 flex-1 bg-greenery-500 hover:bg-greenery-600 text-white font-semibold rounded"
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

export default RegisterFormStep2;
