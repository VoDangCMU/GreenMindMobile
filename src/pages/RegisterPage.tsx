import { useRegisterStore, type Gender } from "@/store/registerStore";
import { Link, useNavigate } from "react-router-dom";
import ProcessIndicator from "@/components/common/ProcessIndicator";
import { Leaf, AlertCircle, Mars, Venus, Lock, Eye, EyeOff, CheckCircle, MapPin, Search } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePickerField } from "@/components/native-wrapper/DatePicker";
import { Drawer } from "vaul";
import React from "react";
import { getCountryNames, getCitiesByCountry } from "@/apis/countries";
import { registerUser } from "@/apis/backend/v2/register";
import type { TRegion } from "@/apis/backend/v2/register";
import { getGeocode } from "@/apis/nominatim/reverseGeocode";
import { toast } from "sonner";

// ========== STEP 1 COMPONENT ==========
interface Step1Props {
  formData: any;
  errors: any;
  isLoading: boolean;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleGenderSelect: (gender: Gender) => void;
  handleNext: () => void;
}

function RegisterFormStep1({ formData, errors, isLoading, handleInputChange, handleGenderSelect, handleNext }: Step1Props) {
  return (
    <>
      <div className="space-y-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700 font-medium">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={`h-12 ${errors.firstName ? "border-red-500" : ""}`}
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
          <Label htmlFor="lastName" className="text-gray-700 font-medium">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={`h-12 ${errors.lastName ? "border-red-500" : ""}`}
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
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value.toLowerCase())}
            className={`h-12 ${errors.email ? "border-red-500" : ""}`}
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
          <Label className="text-gray-700 font-medium">Gender</Label>
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

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={isLoading}
          className="h-12 w-full bg-greenery-500 hover:bg-greenery-600 text-white font-semibold rounded"
        >
          Continue
        </button>
      </div>
    </>
  );
}

// ========== STEP 2 COMPONENT ==========
interface Step2Props {
  formData: any;
  errors: any;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordStrength: { strength: number; label: string; color: string };
  detectedRegion: string;
  countries: string[];
  cities: string[];
  selectedCountry: string;
  openCountry: boolean;
  openCity: boolean;
  searchCountry: string;
  searchCity: string;
  filteredCountries: string[];
  filteredCities: string[];
  setShowPassword: (val: boolean) => void;
  setShowConfirmPassword: (val: boolean) => void;
  setOpenCountry: (val: boolean) => void;
  setOpenCity: (val: boolean) => void;
  setSearchCountry: (val: string) => void;
  setSearchCity: (val: string) => void;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleSelectCountry: (country: string) => void;
  handleSelectCity: (city: string) => void;
  handleNext: () => void;
  handleBack: () => void;
}

function RegisterFormStep2(props: Step2Props) {
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    passwordStrength,
    detectedRegion,
    openCountry,
    openCity,
    searchCountry,
    searchCity,
    filteredCountries,
    filteredCities,
    selectedCountry,
    setShowPassword,
    setShowConfirmPassword,
    setOpenCountry,
    setOpenCity,
    setSearchCountry,
    setSearchCity,
    handleInputChange,
    handleSelectCountry,
    handleSelectCity,
    handleNext,
    handleBack,
  } = props;

  return (
    <>
      <div className="space-y-4">
        {/* Password */}
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
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`h-12 pr-12 ${errors.password ? "border-red-500" : ""}`}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-8 w-8"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Password strength</span>
                <span
                  className={`font-medium ${
                    passwordStrength.strength <= 25
                      ? "text-red-600"
                      : passwordStrength.strength <= 50
                      ? "text-yellow-600"
                      : passwordStrength.strength <= 75
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
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

        {/* Confirm Password */}
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
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={`h-12 pr-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

        {/* Date of Birth */}
        <DatePickerField
          label="Date of Birth"
          value={formData.dateOfBirth}
          error={errors.dateOfBirth}
          onChange={(val) => handleInputChange("dateOfBirth", val)}
        />

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700 font-medium flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </Label>

          {/* Country Drawer */}
          <Drawer.Root open={openCountry} onOpenChange={setOpenCountry}>
            <Drawer.Trigger asChild>
              <Button
                variant="outline"
                className={`h-12 w-full justify-between text-left ${errors.location ? "border-red-500" : ""}`}
              >
                {selectedCountry || "Select your country"}
              </Button>
            </Drawer.Trigger>

            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
              <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg flex flex-col max-h-[80vh]">
                <div className="p-4 border-b">
                  <Drawer.Title className="text-base font-semibold text-gray-800">Select Country</Drawer.Title>
                  <Drawer.Description className="text-sm text-gray-500">
                    Choose your country from the list below
                  </Drawer.Description>
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1 overflow-hidden">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search country..."
                      value={searchCountry}
                      onChange={(e) => setSearchCountry(e.target.value)}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                  <ScrollArea className="flex-1 h-full">
                    {filteredCountries.map((country) => (
                      <button
                        key={country}
                        onClick={() => handleSelectCountry(country)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                      >
                        {country}
                      </button>
                    ))}
                  </ScrollArea>
                </div>

                <div className="p-3 border-t flex justify-end">
                  <Drawer.Close asChild>
                    <Button variant="secondary">Close</Button>
                  </Drawer.Close>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          {/* City Drawer */}
          {props.cities.length > 0 && (
            <Drawer.Root open={openCity} onOpenChange={setOpenCity}>
              <Drawer.Trigger asChild>
                <Button variant="outline" className="h-12 w-full justify-between text-left">
                  {formData.location.includes(",") ? formData.location.split(",")[0] : "Select your city"}
                </Button>
              </Drawer.Trigger>

              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg flex flex-col max-h-[80vh]">
                  <div className="p-4 border-b">
                    <Drawer.Title className="text-base font-semibold text-gray-800">Select City</Drawer.Title>
                    <Drawer.Description className="text-sm text-gray-500">Choose your city below</Drawer.Description>
                  </div>

                  <div className="p-4 flex flex-col gap-3 flex-1 overflow-hidden">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search city..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="pl-8 h-9 text-sm"
                      />
                    </div>
                    <ScrollArea className="flex-1 h-full">
                      {filteredCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleSelectCity(city)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                        >
                          {city}
                        </button>
                      ))}
                    </ScrollArea>
                  </div>

                  <div className="p-3 border-t flex justify-end">
                    <Drawer.Close asChild>
                      <Button variant="secondary">Close</Button>
                    </Drawer.Close>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          )}

          {errors.location && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.location}</span>
            </div>
          )}
        </div>

        {/* Auto-detected Region (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="region" className="text-gray-700 font-medium">
            Vietnam Region (Auto-detected)
          </Label>
          <Input
            id="region"
            type="text"
            value={detectedRegion}
            readOnly
            className="h-12 bg-gray-50 cursor-not-allowed"
            placeholder="Select location first"
          />
          <p className="text-xs text-gray-500">
            Auto-detected based on latitude: North ≥16°, Central 12-16°, South &lt;12°
          </p>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={handleBack}
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
          Continue
        </button>
      </div>
    </>
  );
}

// ========== STEP 3 COMPONENT ==========
interface Step3Props {
  formData: any;
  errors: any;
  isLoading: boolean;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleSubmit: () => void;
  handleBack: () => void;
}

function RegisterFormStep3({ formData, errors, isLoading, handleInputChange, handleSubmit, handleBack }: Step3Props) {
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
              onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" className="text-greenery-600 hover:text-greenery-700 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-greenery-600 hover:text-greenery-700 underline">
                  Privacy Policy
                </Link>
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
              onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
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
          onClick={handleBack}
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
}

// ========== MAIN PAGE COMPONENT ==========
export default function RegisterPage() {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    currentStep,
    isLoading,
    errors,
    setShowPassword,
    setShowConfirmPassword,
    setFormData,
    setErrors,
    setCurrentStep,
    setIsLoading,
  } = useRegisterStore();
  const setBypassAuthGate = useAuthStore((state) => state.setBypassAuthGate);
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const navigate = useNavigate();

  // Step 2 states
  const [countries, setCountries] = React.useState<string[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = React.useState<string>("");
  const [openCountry, setOpenCountry] = React.useState(false);
  const [openCity, setOpenCity] = React.useState(false);
  const [searchCountry, setSearchCountry] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");
  const [detectedRegion, setDetectedRegion] = React.useState<string>("");

  React.useEffect(() => {
    setCountries(getCountryNames());
  }, []);

  // Auto-detect region when location changes
  React.useEffect(() => {
    const detectRegion = async () => {
      if (!formData.location) {
        setDetectedRegion("");
        return;
      }

      try {
        console.log("Detecting region for:", formData.location);
        const result = await getGeocode(formData.location);
        console.log("Geocode result:", result);

        // Nominatim search API returns array, take first result
        const data = Array.isArray(result) ? result[0] : result;
        
        if (!data || !data.lat) {
          console.log("No valid result from geocode");
          setDetectedRegion("");
          return;
        }

        const lat = parseFloat(data.lat);
        console.log("Parsed latitude:", lat);

        if (isNaN(lat)) {
          setDetectedRegion("");
          return;
        }


        let region = "";
        if (lat >= 20.3) {
          region = "North";
        } else if (lat >= 12.0 && lat < 20.3) {
          region = "Central";
        } else if (lat < 12.0) {
          region = "South";
        }

        if (!formData.location.includes("Vietnam"))
          region = "Unknown";

        console.log("Detected region:", region);
        setDetectedRegion(region);
      } catch (error) {
        console.error("Failed to detect region:", error);
        setDetectedRegion("");
      }
    };

    void detectRegion();
  }, [formData.location]);

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
    if (strength <= 50) return { strength, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 75) return { strength, label: "Good", color: "bg-blue-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Step 1 handlers
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ [field]: value });
    if (errors[field as keyof typeof errors]) setErrors({ ...errors, [field]: undefined });
  };

  const handleGenderSelect = (gender: Gender) => {
    setFormData({ gender });
    if (errors.gender) setErrors({ ...errors, gender: undefined });
  };

  const validateStep1 = () => {
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

  const handleStep1Next = () => {
    if (validateStep1()) setCurrentStep(2);
  };

  // Step 2 handlers
  const handleSelectCountry = async (country: string) => {
    setSelectedCountry(country);
    setFormData({ location: country });
    setOpenCountry(false);
    const cityList = getCitiesByCountry(country);
    setCities(cityList.map((c) => c.name).sort());
  };

  const handleSelectCity = (city: string) => {
    setFormData({ location: `${city}, ${selectedCountry}` });
    setOpenCity(false);
  };

  const validateStep2 = () => {
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

  const handleStep2Next = () => {
    if (validateStep2()) setCurrentStep(3);
  };

  // Step 3 handlers
  const validateStep3 = () => {
    const newErrors: typeof errors = {};
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setIsLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        date_of_birth: formData.dateOfBirth,
        location: formData.location,
        gender: formData.gender,
        region: (detectedRegion || 'Unknown') as TRegion,
      };

      console.log("Submitting registration with payload:", payload);

      const data = await registerUser(payload);

      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      // Map backend v2 user shape to application IUser shape
      const mappedUser = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        full_name: (data.user as any).full_name || (data.user as any).fullName || "",
        role: data.user.role,
        gender: data.user.gender,
        location: data.user.location,
      };

      setUser(mappedUser as any);

      toast.success("Đăng ký thành công! Đang chuyển hướng...");

      navigate("/onboarding");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đăng ký hoặc đăng nhập thất bại!");
      console.error("Registration or login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(searchCountry.toLowerCase())
  );
  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(searchCity.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-greenery-700 tracking-tight">GREEN MIND</h1>
          </Link>
        </div>

        <div className="flex flex-1 flex-col w-full max-w-sm justify-center">
          {/* Progress Indicator */}
          <ProcessIndicator currentStep={currentStep} maxStep={3} showSteps />
          <div className="space-y-6 mt-6">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <RegisterFormStep1
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                handleGenderSelect={handleGenderSelect}
                handleNext={handleStep1Next}
              />
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <RegisterFormStep2
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                passwordStrength={passwordStrength}
                detectedRegion={detectedRegion}
                countries={countries}
                cities={cities}
                selectedCountry={selectedCountry}
                openCountry={openCountry}
                openCity={openCity}
                searchCountry={searchCountry}
                searchCity={searchCity}
                filteredCountries={filteredCountries}
                filteredCities={filteredCities}
                setShowPassword={setShowPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                setOpenCountry={setOpenCountry}
                setOpenCity={setOpenCity}
                setSearchCountry={setSearchCountry}
                setSearchCity={setSearchCity}
                handleInputChange={handleInputChange}
                handleSelectCountry={handleSelectCountry}
                handleSelectCity={handleSelectCity}
                handleNext={handleStep2Next}
                handleBack={() => setCurrentStep(1)}
              />
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <RegisterFormStep3
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                handleBack={() => setCurrentStep(2)}
              />
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
