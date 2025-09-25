"use client";

import { useRegisterStore } from "@/store/registerStore";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/AppHeader";
import RegisterFormStep1 from "@/components/RegisterFormStep1";
import RegisterFormStep2 from "@/components/RegisterFormStep2";
import RegisterFormStep3 from "@/components/RegisterFormStep3";
import ProcessIndicator from "@/components/ProcessIndicator";

export default function RegisterPage() {
  const {
    formData,
    errors,
    showPassword,
    showConfirmPassword,
    isLoading,
    currentStep,
    setFormData,
    setErrors,
    setShowPassword,
    setShowConfirmPassword,
    setIsLoading,
  } = useRegisterStore();

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData({ [field]: value } as any);
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Registration data:", formData);
      window.location.href = "/onboarding";
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (
    password: string
  ): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;

    if (strength <= 25) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 50)
      return { strength, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 75)
      return { strength, label: "Good", color: "bg-blue-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const locations = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Sweden",
    "Other",
  ];

  return (
    <SafeAreaLayout header={<AppHeader showBack title="Register" />}>
      <div className="bg-gradient-to-br from-greenery-50 to-greenery-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Progress Indicator */}
          <ProcessIndicator currentStep={currentStep} maxStep={3} showSteps />

          <Card className="border-0 shadow-xl">
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <RegisterFormStep1
                  formData={formData}
                  errors={errors}
                  onChange={(field, value) =>
                    handleInputChange(field as keyof typeof formData, value)
                  }
                  isLoading={isLoading}
                  setErrors={setErrors}
                />
              )}

              {currentStep === 2 && (
                <RegisterFormStep2
                  formData={formData}
                  errors={errors}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  onToggleShowPassword={() => setShowPassword(!showPassword)}
                  onToggleShowConfirmPassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  onChange={(field, value) =>
                    handleInputChange(field as keyof typeof formData, value)
                  }
                  passwordStrength={passwordStrength}
                  locations={locations}
                  isLoading={isLoading}
                  setErrors={setErrors}
                />
              )}

              {currentStep === 3 && (
                <RegisterFormStep3
                  formData={formData}
                  errors={errors}
                  onChange={(field, value) =>
                    handleInputChange(field as keyof typeof formData, value)
                  }
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  setErrors={setErrors}
                />
              )}

              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="text-greenery-600 hover:text-greenery-700 font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SafeAreaLayout>
  );
}
