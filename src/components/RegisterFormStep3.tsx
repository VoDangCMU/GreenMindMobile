import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useRegisterStore } from "@/store/registerStore";

interface Props {}

import { registerUser } from "@/apis/register";
import { toast } from "sonner";
import { loginUser } from "@/apis/login";
import { useAppStore } from "@/store/appStore";
const RegisterFormStep3: React.FC<Props> = () => {
  const { isLoading, formData, errors, setFormData, setErrors, setCurrentStep, setIsLoading } = useRegisterStore();
  const setAuth = useAppStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: boolean) => {
    setFormData({ [field]: value });
    if (errors && errors[field as keyof typeof errors]) setErrors({ ...errors, [field]: undefined });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        date_of_birth: formData.dateOfBirth,
        location: formData.location,
        gender: formData.gender
      };

      console.log("Submitting registration with payload:", payload);

      const data = await registerUser(payload);
      const loginData = await loginUser({ email: formData.email, password: formData.password });

      setAuth({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      });

      toast.success("Đăng ký thành công! Đang chuyển hướng...");

      navigate("/onboarding");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đăng ký hoặc đăng nhập thất bại!");
      console.error("Registration or login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-greenery-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-greenery-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">You're almost ready!</h3>
          <p className="text-sm text-gray-600">Just a few final details to complete your registration</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={checked => handleInputChange("agreeToTerms", checked as boolean)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                I agree to the {" "}
                <Link to="/terms" className="text-greenery-600 hover:text-greenery-700 underline">Terms of Service</Link>{" "}
                and {" "}
                <Link to="/privacy" className="text-greenery-600 hover:text-greenery-700 underline">Privacy Policy</Link>
              </Label>
              {errors.agreeToTerms && (
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">{errors.agreeToTerms}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onCheckedChange={checked => handleInputChange("subscribeNewsletter", checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="subscribeNewsletter" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
              I'd like to receive updates about new features, sustainability tips, and community highlights
            </Label>
          </div>
        </div>
        <div className="bg-greenery-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-greenery-800 mb-2">What happens next?</h4>
          <ul className="text-xs text-greenery-700 space-y-1">
            <li>• Complete your personality assessment</li>
            <li>• Set up your sustainability goals</li>
            <li>• Start tracking your impact</li>
            <li>• Connect with the Green Mind community</li>
          </ul>
        </div>
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="h-12 w-1/2 bg-gray-200 text-gray-700 font-semibold rounded"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-12 w-1/2 bg-greenery-500 hover:bg-greenery-600 text-white font-semibold rounded"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Registering...</span>
            </div>
          ) : (
            "Register"
          )}
        </button>
      </div>
    </>
  );
};

export default RegisterFormStep3;
