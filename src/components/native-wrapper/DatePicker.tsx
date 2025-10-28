import React from "react"
import { Capacitor } from "@capacitor/core"
import { DatePicker } from "@capacitor-community/date-picker"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react"

interface DatePickerFieldProps {
  label?: string
  value?: string
  error?: string
  onChange: (value: string) => void
  minYear?: number
  maxYear?: number
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label = "Date of Birth",
  value,
  error,
  onChange,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
}) => {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [openDate, setOpenDate] = React.useState(false)

  React.useEffect(() => {
    if (value) setDate(new Date(value))
  }, [value])

  const handleNativePick = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await DatePicker.present({
          mode: "date",
          locale: "en_US",
          format: "yyyy-MM-dd",
          theme: "auto",
          date: date ? date.toISOString().split("T")[0] : undefined,
          min: `${minYear}-01-01`,
          max: `${maxYear}-12-31`,
        })
        if (result?.value) {
          const selected = new Date(result.value)
          setDate(selected)
          onChange(selected.toISOString().split("T")[0])
        }
      } catch (err) {
        console.warn("DatePicker cancelled or failed", err)
      }
    } else {
      setOpenDate(true)
    }
  }

  return (
    <div className="space-y-2">
      <Label
        htmlFor={label}
        className="text-gray-700 font-medium flex items-center space-x-1"
      >
        <CalendarIcon className="w-4 h-4" />
        <span>{label}</span>
      </Label>

      <Popover open={openDate} onOpenChange={setOpenDate}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>

        <Button
          variant="outline"
          onClick={handleNativePick}
          className={`h-12 w-full justify-start text-left font-normal border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 ${
            error ? "border-red-500" : ""
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? date.toLocaleDateString() : "Pick a date"}
        </Button>

        {/* Popover Calendar fallback for web */}
        <PopoverContent className="w-auto p-0 z-[9999]">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              if (selectedDate) {
                onChange(selectedDate.toISOString().split("T")[0])
              }
              setOpenDate(false)
            }}
            disabled={(d) =>
              d > new Date(`${maxYear}-12-31`) ||
              d < new Date(`${minYear}-01-01`)
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {error && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  )
}
