import { create } from 'zustand';

export type Gender = "Male" | "Female" | "Other";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  location: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
  gender: Gender;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  location?: string;
  agreeToTerms?: string;
  gender?: string;
}

interface RegisterState {
  formData: FormData;
  errors: FormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  currentStep: number;
  setFormData: (data: Partial<FormData>) => void;
  setErrors: (errors: FormErrors) => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  location: '',
  agreeToTerms: false,
  subscribeNewsletter: true,
  gender: "Other",
};

export const useRegisterStore = create<RegisterState>((set) => ({
  formData: initialFormData,
  errors: {},
  showPassword: false,
  showConfirmPassword: false,
  isLoading: false,
  currentStep: 1,
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setErrors: (errors) => set({ errors }),
  setShowPassword: (show) => set({ showPassword: show }),
  setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () => set({
    formData: initialFormData,
    errors: {},
    showPassword: false,
    showConfirmPassword: false,
    isLoading: false,
    currentStep: 1,
  }),
}));
