import React from "react";
import { Capacitor } from "@capacitor/core";
import { DatePicker } from "@capacitor-community/date-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { AlertCircle, Calendar as CalendarIcon, Clock } from "lucide-react";

type Mode = "date" | "time" | "datetime";

interface Props {
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  mode?: Mode;
  label?: string;
  placeholder?: string;
  min?: string; // ISO date string yyyy-mm-dd
  max?: string; // ISO date string
  disabled?: boolean;
  error?: string | null;
  locale?: string; // e.g. 'en-US' or 'vi-VN'
}

const formatDateForDisplay = (d: Date | null, mode: Mode, locale = navigator.language) => {
  if (!d) return "";
  if (mode === "date") return d.toLocaleDateString(locale);
  if (mode === "time") return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  // datetime
  return d.toLocaleString(locale, { hour: "2-digit", minute: "2-digit" });
};

const toISODate = (d: Date) => d.toISOString().split("T")[0];
const toISOTime = (d: Date) => d.toISOString().split("T")[1]?.slice(0, 5) ?? "";

const AppDateTimePicker: React.FC<Props> = ({
  value = null,
  onChange,
  mode = "date",
  label,
  placeholder,
  min,
  max,
  disabled = false,
  error = null,
  locale = "en-US",
}) => {
  const [open, setOpen] = React.useState(false); // web popover
  const [internalDate, setInternalDate] = React.useState<Date | null>(value);
  const [timePart, setTimePart] = React.useState<string>(value ? toISOTime(value) : "00:00");

  React.useEffect(() => {
    setInternalDate(value ?? null);
    setTimePart(value ? toISOTime(value) : "00:00");
  }, [value]);

  const callOnChange = (d: Date | null) => {
    setInternalDate(d);
    if (d) setTimePart(toISOTime(d));
    if (onChange) onChange(d);
  };

  const openNativePicker = async () => {
    try {
      // config for DatePicker plugin
      const opts: any = {
        mode: mode === "datetime" ? "datetime" : mode,
        theme: "auto",
      };

      if (internalDate) {
        // plugin accepts date as ISO string (date) or full ISO depending on mode
        if (mode === "time") {
          opts.time = toISOTime(internalDate);
        } else {
          opts.date = mode === "date" ? toISODate(internalDate) : internalDate.toISOString();
        }
      } else {
        // default to today
        const now = new Date();
        if (mode === "time") opts.time = toISOTime(now);
        else opts.date = mode === "date" ? toISODate(now) : now.toISOString();
      }

      if (min) opts.min = min;
      if (max) opts.max = max;

      const res: any = await DatePicker.present(opts);
      if (res && res.value) {
        // plugin returns ISO-ish date/time string in res.value
        const picked = new Date(res.value);
        callOnChange(picked);
      }
    } catch (err) {
      // user cancelled or error
      // console.warn("DatePicker error/cancel:", err);
    }
  };

  const handleButtonClick = async () => {
    if (disabled) return;
    if (Capacitor.isNativePlatform()) {
      await openNativePicker();
    } else {
      // web fallback
      setOpen(true);
    }
  };

  // Web fallback handlers
  const handleWebDateSelect = (d: Date | null) => {
    if (!d) {
      callOnChange(null);
      setOpen(false);
      return;
    }
    if (mode === "date") {
      callOnChange(d);
      setOpen(false);
    } else if (mode === "time") {
      // keep date part as today; combine with timePart
      const [hh, mm] = timePart.split(":").map(s => parseInt(s || "0", 10));
      const now = new Date();
      const combined = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm);
      callOnChange(combined);
      setOpen(false);
    } else if (mode === "datetime") {
      // user selected date — keep timePart => combine
      const [hh, mm] = timePart.split(":").map(s => parseInt(s || "0", 10));
      const combined = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm);
      callOnChange(combined);
      setOpen(false);
    }
  };

  const handleTimeInputChange = (v: string) => {
    setTimePart(v);
    if (mode === "time") {
      // For time-only, update immediately
      const [hh, mm] = v.split(":").map(s => parseInt(s || "0", 10));
      const now = new Date();
      const combined = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm);
      callOnChange(combined);
    } else if (mode === "datetime" && internalDate) {
      const d = new Date(internalDate);
      const [hh, mm] = v.split(":").map(s => parseInt(s || "0", 10));
      d.setHours(hh, mm, 0, 0);
      callOnChange(d);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <Label className="flex items-center space-x-2 mb-1">
          {mode === "time" ? <Clock className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
          <span>{label}</span>
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        {/* anchor trigger for popover positioning (empty div is fine) */}
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleButtonClick}
            variant="outline"
            className={`h-12 w-full justify-start text-left ${disabled ? "opacity-50 pointer-events-none" : ""}`}
            aria-disabled={disabled}
          >
            {internalDate ? formatDateForDisplay(internalDate, mode, locale) : (placeholder ?? (mode === "date" ? "Pick a date" : mode === "time" ? "Pick time" : "Pick date & time"))}
          </Button>

          {/* optional quick-clear button */}
          <Button
            variant="ghost"
            onClick={() => callOnChange(null)}
            className="h-12 w-12"
            aria-label="Clear date"
          >
            ✕
          </Button>
        </div>

        {/* PopoverContent: only used on web */}
        <PopoverContent className="w-[320px] p-2 z-[9999]">
          {/* For date or datetime, show Calendar */}
          {mode !== "time" && (
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={internalDate ?? undefined}
              onSelect={(d) => handleWebDateSelect(d ?? null)}
              disabled={(d) => {
                const dd = new Date(d);
                if (min && new Date(min) > dd) return true;
                if (max && new Date(max) < dd) return true;
                return dd > new Date(); // optional: block future dates
              }}
              initialFocus
            />
          )}

          {/* Time input for time or datetime */}
          {(mode === "time" || mode === "datetime") && (
            <div className="mt-2 px-2">
              <label className="text-xs text-gray-600 mb-1 block">Time</label>
              <Input
                type="time"
                value={timePart}
                onChange={(e) => handleTimeInputChange(e.target.value)}
                className="h-10"
              />
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // if date part missing for datetime, use today
                    if (mode === "datetime") {
                      const datePart = internalDate ?? new Date();
                      handleWebDateSelect(datePart);
                    } else if (mode === "time") {
                      // already updated on change
                      setOpen(false);
                    }
                  }}
                >
                  OK
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {error && (
        <div className="flex items-center space-x-1 text-red-600 mt-1 text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default AppDateTimePicker;
