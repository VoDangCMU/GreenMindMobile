// src/hooks/useDirectedBack.ts
import { useNavigate } from "react-router-dom";
import { useNavigationDirection } from "@/store/navigationDirectionStore";

/**
 * Hook "Back" có animation đúng hướng
 * Giúp trang hiện tại trượt ra phải (backward)
 *
 * @example
 * const back = useDirectedBack();
 * back();
 */
export function useDirectedBack() {
  const navigate = useNavigate();
  const { setDirection } = useNavigationDirection();

  /**
   * Điều hướng back với animation trượt sang phải.
   * @param fallback - nếu không có trang trước, điều hướng tới fallback route (tuỳ chọn)
   */
  return function back(fallback?: string) {
    setDirection("back");

    // Nếu có history trước thì quay lại
    if (window.history.length > 1) {
      navigate(-1);
    } else if (fallback) {
      // Nếu không có history, điều hướng đến fallback route
      navigate(fallback);
    }
  };
}
