import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Calendar, MapPin, Search } from "lucide-react";
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRegisterStore } from "@/store/registerStore";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCountryNames, getCitiesByCountry } from "@/apis/countries";
import { uuid } from "@/store/invoiceStore";

interface Props {
  showPassword: boolean;
  showConfirmPassword: boolean;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
  passwordStrength: { strength: number; label: string; color: string };
}

const RegisterFormStep2: React.FC<Props> = ({
  showPassword,
  showConfirmPassword,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
  passwordStrength,
}) => {
  const { isLoading, formData, errors, setFormData, setErrors, setCurrentStep } = useRegisterStore();

  const [countries, setCountries] = React.useState<string[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = React.useState<string>("");
  const [openCountry, setOpenCountry] = React.useState(false);
  const [openCity, setOpenCity] = React.useState(false);
  const [searchCountry, setSearchCountry] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");

  React.useEffect(() => {
    setCountries(getCountryNames());
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ [field]: value });
    if (errors && errors[field as keyof typeof errors]) setErrors({ ...errors, [field]: undefined });
  };

  const handleSelectCountry = async (country: string) => {
    setSelectedCountry(country);
    setFormData({ location: country });
    setOpenCountry(false);
    const cityList = getCitiesByCountry(country);
    setCities(cityList.map(c => c.name).sort());

    console.log("Cities for country", country, cities);
  };

  const handleSelectCity = (city: string) => {
    setFormData({ location: `${city}, ${selectedCountry}` });
    setOpenCity(false);
  };

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

  // Lọc danh sách dựa trên search
  const filteredCountries = countries.filter(c => c.toLowerCase().includes(searchCountry.toLowerCase()));
  const filteredCities = cities.filter(c => c.toLowerCase().includes(searchCity.toLowerCase()));

  return (
    <>
      <CardHeader className="space-y-4 text-center pb-6">
        <div>
          <CardTitle className="text-xl text-gray-800">Secure Your Account</CardTitle>
          <CardDescription className="text-gray-600">Set up your password and profile details</CardDescription>
        </div>
      </CardHeader>
      <div className="space-y-4">
        {/* --- Password --- */}
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
              onChange={e => handleInputChange("password", e.target.value)}
              className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 pr-12 ${
                errors.password ? "border-red-500" : ""
              }`}
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

        {/* --- Confirm Password --- */}
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
              onChange={e => handleInputChange("confirmPassword", e.target.value)}
              className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 pr-12 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
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

        {/* --- Date of Birth --- */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Date of Birth</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={e => handleInputChange("dateOfBirth", e.target.value)}
            className={`h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${
              errors.dateOfBirth ? "border-red-500" : ""
            }`}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.dateOfBirth && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{errors.dateOfBirth}</span>
            </div>
          )}
        </div>

        {/* --- LOCATION (Popover) --- */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700 font-medium flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </Label>

          {/* --- COUNTRY --- */}
          <Popover open={openCountry} onOpenChange={setOpenCountry}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-12 w-full justify-between text-left ${
                  errors.location ? "border-red-500" : ""
                }`}
              >
                {selectedCountry || "Select your country"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-2">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search country..."
                  value={searchCountry}
                  onChange={e => setSearchCountry(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <ScrollArea className="h-[200px]">
                {filteredCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => handleSelectCountry(country)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    {country}
                  </button>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* --- CITY --- */}
          {cities.length > 0 && (
            <Popover open={openCity} onOpenChange={setOpenCity}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-12 w-full justify-between text-left ${
                    errors.location ? "border-red-500" : ""
                  }`}
                >
                  {formData.location.includes(",")
                    ? formData.location.split(",")[0]
                    : "Select your city"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search city..."
                    value={searchCity}
                    onChange={e => setSearchCity(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
                <ScrollArea className="h-[200px]">
                  {filteredCities.map((city) => (
                    <button
                      key={uuid()}
                      onClick={() => handleSelectCity(city)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      {city}
                    </button>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}

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
