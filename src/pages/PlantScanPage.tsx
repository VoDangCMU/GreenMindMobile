import AppHeader from "@/components/common/AppHeader";
import AppHeaderButton from "@/components/common/AppHeaderButton";
import { Loader2, Check, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import PageActionFooter from "@/components/common/PageActionFooter";
import usePlantScanStore, { type PlantScanResult } from "@/store/plantScanStore";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem } from "@capacitor/filesystem";
import type { IHealthyFoodRatio } from "@/apis/ai/monitor_ocean";
import { useAppStore } from "@/store/appStore";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import { useOceanUpdate } from "@/hooks/v1/useOceanUpdate";
import { useHealthyFoodRatio } from "@/hooks/metric/useHealthyFoodRatio";
import { useMetricFeedbackStore } from "@/store/v2/metricFeedbackStore";
import { MetricFeedbackCard } from "./MetricsPage";
import planScan from "@/apis/backend/v1/ai-forward/image-processing/plan-scan";
import { useToast } from "@/hooks/useToast";

function PlantScanList({
  scans,
  onScanClick,
}: {
  scans: PlantScanResult[];
  onScanClick: (scan: any) => void;
}) {
  // Helper to check if base64 is valid (not empty/null/undefined)
  const isValidBase64 = (b64: any) =>
    typeof b64 === "string" && b64.length > 20;
  return (
    <div className="space-y-4">
      {scans.map((scan) => (
        <div
          key={scan.id}
          className="bg-white rounded-lg shadow p-4 flex items-center gap-4 cursor-pointer"
          onClick={() => onScanClick(scan)}
        >
          {isValidBase64(scan.plant_image_base64) ? (
            <img
              src={`${scan.plant_image_base64}`}
              alt="Dish"
              className="w-16 h-16 object-cover rounded"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded text-gray-400 text-xs">
              No image
            </div>
          )}
          <div className="flex-1">
            <div className="font-semibold text-green-700">
              Rau củ: {scan.vegetable_ratio_percent}%
            </div>
            <div className="text-xs text-gray-500">{scan.createdAt}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlantScanDetailModal({
  scan,
  open,
  onClose,
}: {
  scan: PlantScanResult;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !scan) return null;
  // Helper to check if base64 is valid (not empty/null/undefined)
  const isValidBase64 = (b64: any) =>
    typeof b64 === "string" && b64.length > 20;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-4">
          {isValidBase64(scan.plant_image_base64) ? (
            <img
              src={`${scan.plant_image_base64}`}
              alt="Dish"
              className="w-full rounded mb-2"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded mb-2 text-gray-400 text-sm">
              No dish image
            </div>
          )}
        </div>
        <div className="font-semibold text-green-700 mb-2">
          Rau củ: {scan.vegetable_ratio_percent}%
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Dish area: {scan.dish_area} | Vegetable area: {scan.vegetable_area}
        </div>
        <div className="text-xs text-gray-400">{scan.createdAt}</div>
      </div>
    </div>
  );
}

export default function PlantScanPage() {
  const scans = usePlantScanStore((state) => state.scans);
  const addScan = usePlantScanStore((state) => state.addScan);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const setOcean = useAppStore((state) => state.setOcean);
  const ocean = useAppStore((state) => state.ocean);
  const toast = useToast();
  const { updateOcean } = useOceanUpdate();
  const { callHealthyFoodRatio } = useHealthyFoodRatio();
  const preAppSurveyAnswers = usePreAppSurveyStore((state) => state.answers);
  const foodRatioFeedback = useMetricFeedbackStore((s) => s.getFeedback("healthy_food_ratio"));

  const navigate = useNavigate();
  const location = useLocation();

  // Auto-trigger camera if navigated with { state: { startScan: true } }
  useEffect(() => {
    if ((location as any)?.state?.startScan) {
      handleScan();
      // clear state to avoid re-trigger on back navigation
      navigate(location.pathname, { replace: true });
    }
  }, []);

  // Calculate plant_meals and total_meals from scans - REMOVED (now per-scan)
  // const calculateMealStats = () => {
  //   const totalScans = scans.length;
  //   const plantScans = scans.filter(scan => scan.vegetable_ratio_percent > 20).length; // Consider >20% as plant meal
  //   return { plant_meals: plantScans, total_meals: totalScans };
  // };

  // Get base_likert from preAppSurvey healthy_food_ratio
  const getBaseLikert = () => {
    if (preAppSurveyAnswers?.healthy_food_ratio) {
      return parseInt(preAppSurveyAnswers.healthy_food_ratio);
    }
    return 3; // default
  };

  // Trigger OCEAN update immediately after scan
  const triggerOceanUpdateFromScan = async (scanResult: any) => {
    console.log("Triggering OCEAN update from scan result:", scanResult);
    if (!ocean) {
      console.warn("Ocean score missing, skipping update");
      return;
    }
    const base_likert = getBaseLikert();

    // Logic: Map vegetable_area -> plant_meals, dish_area -> total_meals
    const plant_meals = parseInt(scanResult.vegetable_area, 10) || 0;
    const total_meals = parseInt(scanResult.dish_area, 10) || 0;

    const data: IHealthyFoodRatio = {
      plant_meals,
      total_meals,
      base_likert,
      weight: 0.25,
      direction: "up",
      sigma_r: 1.0,
      alpha: 0.5,
      ocean_score: {
        O: ocean.O / 100,
        C: ocean.C / 100,
        E: ocean.E / 100,
        A: ocean.A / 100,
        N: ocean.N / 100,
      },
    };

    console.log("Calling healthy food ratio with payload:", data);

    try {
      const res = await callHealthyFoodRatio(data);
      console.log("Healthy food ratio response:", res);
      if (res && res.new_ocean_score) {
        updateOcean(res.new_ocean_score);
        setOcean(res.new_ocean_score);
        console.log(`OCEAN updated from scan! Area Ratio: ${plant_meals}/${total_meals}`);
      } else {
        console.warn("API response valid but missing new_ocean_score?");
      }
    } catch (error) {
      console.warn("Update OCEAN from scan failed:", error);
    }
  };

  // REMOVED manual update function
  /*
  const handleUpdateOcean = async () => { ... }
  */

  // Helper to extract base64 from photo (web/native)
  // Always use Capacitor Filesystem API to get base64 from photo
  // Helper to extract base64 from photo (works safely on both web & native)
  const getBase64FromPhoto = async (photo: any): Promise<string | null> => {
    try {
      if (photo.path) {
        const file = await Filesystem.readFile({ path: photo.path });

        if (typeof file.data === "string") {
          // Native (Android/iOS): already base64
          return file.data;
        }

        // Web: Blob → convert to base64
        if (file.data instanceof Blob) {
          const blob = file.data;
          return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              resolve(result.split(",")[1]); // remove data:image/... prefix
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
      }

      // Fallbacks
      if (photo.base64String) return photo.base64String;

      if (photo.webPath) {
        const res = await fetch(photo.webPath);
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (err) {
      console.warn("Failed to convert photo to base64:", err);
    }

    return null;
  };

  const handleScan = async () => {
    console.log("Starting Scan...");
    setIsScanning(true);
    try {
      console.log("Opening Camera...");
      const photo = await Camera.getPhoto({
        quality: 60,
        width: 1024,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: false,
        allowEditing: false,
      });
      // const result = await analyzeImagePlant(photo);
      const result = await planScan(photo)
      const base64 = await getBase64FromPhoto(photo);
      const scan = {
        ...result,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleString(),
        _original_base64: base64,
      };
      console.log("Scan result:", result);
      addScan(scan);
      // Trigger metric update
      console.log("Triggering metric update...");
      await triggerOceanUpdateFromScan(result);
      console.log("Scan flow complete.");
    } catch (e: any) {
      console.error("Scan failed", e);
      toast.error(`Scan failed: ${e?.message || "Unknown error"}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleImport = async () => {
    console.log("Starting Import...");
    setIsScanning(true);
    try {
      console.log("Opening Gallery...");
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        saveToGallery: false,
        allowEditing: false,
      });
      // const result = await analyzeImagePlant(photo);
      const result = await planScan(photo)
      const base64 = await getBase64FromPhoto(photo);
      const scan = {
        ...result,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleString(),
        _original_base64: base64,
      };
      console.log("Import result:", result);
      addScan(scan);
      // Trigger metric update
      console.log("Triggering metric update form import...");
      await triggerOceanUpdateFromScan(result);
      console.log("Import flow complete.");
    } catch (e: any) {
      console.error("Import failed", e);
      toast.error(`Import failed: ${e?.message || "Unknown error"}`);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <SafeAreaLayout
      header={
        <AppHeader
          title="Tỷ lệ thực vật"
          showBack
          rightActions={[
            <AppHeaderButton
              key="feedback"
              icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
              onClick={() => setShowFeedback(!showFeedback)}
            />,
            <AppHeaderButton
              key="scan"
              icon={
                isScanning ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <Check className="h-6 w-6 text-green-500" />
                )
              }
              onClick={handleScan}
            />,
          ]}
        />
      }
      footer={<PageActionFooter onScan={handleScan} onImport={handleImport} />}
    >
      <div className="flex flex-col bg-gradient-to-br">
        <div className="flex-1 w-full mx-auto px-3 pb-28">
          {/* Feedback Section */}
          {showFeedback && (
            <div className="mb-4">
              {foodRatioFeedback ? (
                <MetricFeedbackCard feedback={foodRatioFeedback} />
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 text-center">Feedback unavailable</p>
                  <p className="text-xs text-gray-400 text-center mt-1">Update OCEAN to see feedback</p>
                </div>
              )}
            </div>
          )}

          <PlantScanList
            scans={scans}
            onScanClick={(scan) => {
              setSelectedScan(scan);
              setShowModal(true);
            }}
          />
        </div>
      </div>
      <PlantScanDetailModal
        scan={selectedScan}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </SafeAreaLayout>
  );
}
