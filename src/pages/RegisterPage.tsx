import { useRegisterStore } from "@/store/registerStore";
import { Link } from "react-router-dom";
import RegisterFormStep1 from '@/components/app-components/page-components/register/RegisterFormStep1';
import RegisterFormStep2 from '@/components/app-components/page-components/register/RegisterFormStep2';
import RegisterFormStep3 from '@/components/app-components/page-components/register/RegisterFormStep3';
import ProcessIndicator from "@/components/common/ProcessIndicator";
import { Leaf } from "lucide-react";
import { useAuthStore } from "@/store/authStore";


export default function RegisterPage() {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    currentStep,
    setShowPassword,
    setShowConfirmPassword,
  } = useRegisterStore();
  const setBypassAuthGate = useAuthStore((state) => state.setBypassAuthGate);


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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 flex flex-col pl-6 pr-6 pt-20">
        {/* Header top-left */}
        <div className="flex items-center space-x-2 md:absolute md:top-8 md:left-8">
          <Link
            to="/home"
            onClick={() => setBypassAuthGate(true)}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-greenery-500 rounded-full flex items-center justify-center shadow-md">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-greenery-700 tracking-tight">
              GREEN MIND
            </h1>
          </Link>
        </div>

        <div className="flex flex-1 flex-col w-full max-w-sm justify-center">
          {/* Progress Indicator */}
          <ProcessIndicator currentStep={currentStep} maxStep={3} showSteps />
          <div className="space-y-6 mt-6">
            {currentStep === 1 && (
              <RegisterFormStep1 />
            )}
            {currentStep === 2 && (
              <RegisterFormStep2
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onToggleShowPassword={() => setShowPassword(!showPassword)}
                onToggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                passwordStrength={passwordStrength}
              />
            )}
            {currentStep === 3 && (
              <RegisterFormStep3 />
            )}
            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link to="/" className="text-greenery-600 hover:text-greenery-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
