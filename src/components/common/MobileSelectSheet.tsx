import * as React from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Device } from "@capacitor/device"

interface MobileSelectSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerLabel?: string
  placeholder?: string
  items: string[]
  searchValue: string
  onSearchChange: (value: string) => void
  onSelect: (value: string) => void
  forceNative?: boolean
}

export function MobileSelectSheet({
  open,
  onOpenChange,
  triggerLabel,
  placeholder = "Select...",
  items,
  searchValue,
  onSearchChange,
  onSelect,
  forceNative = false,
}: MobileSelectSheetProps) {
  const [isNative, setIsNative] = React.useState<boolean | null>(null)

  React.useEffect(() => {
  // let mounted = true

    const detect = async () => {
    try {
        const info = await Device.getInfo()
        console.log("Device info:", info)
        if (info.platform === "android" || info.platform === "ios") {
        setIsNative(true)
        return
        }

        // Fallback cho devURL: xem như native nếu app đang hiển thị trên màn nhỏ
        if (window.innerWidth < 768) {
        console.log("Using width fallback (devURL) → native mode")
        setIsNative(true)
        return
        }

        setIsNative(false)
    } catch (err) {
        console.warn("Device detection failed:", err)
        setIsNative(window.innerWidth < 768)
    }
    }

    detect()

    return () => {
      // mounted = false
    }
  }, [forceNative])

  // Still deciding — render nothing or a simple trigger to avoid UI flash
  if (isNative === null) {
    return (
      <button
        onClick={() => onOpenChange(true)}
        className={cn("h-12 w-full border rounded-md flex justify-between items-center px-3 text-left text-gray-800 bg-white")}
      >
        {triggerLabel ?? placeholder}
      </button>
    )
  }

  // Native bottom sheet (Dialog)
  if (isNative) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <button
            className={cn(
              "h-12 w-full border rounded-md flex justify-between items-center px-3 text-left",
              "text-gray-800 bg-white active:scale-[0.98] transition-transform"
            )}
          >
            {triggerLabel ?? placeholder}
          </button>
        </DialogTrigger>

        <DialogContent
          className={cn(
            "fixed bottom-0 left-0 right-0 rounded-t-2xl p-4 bg-white",
            "max-h-[80vh] flex flex-col shadow-xl z-[9999]"
          )}
        >
          <div className="w-10 h-0.5 bg-gray-300 rounded-full mx-auto mb-3" />
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>
          <ScrollArea className="flex-1">
            {items.map((item) => (
              <button
                key={item}
                onClick={() => {
                  onSelect(item)
                  onOpenChange(false)
                }}
                className="w-full text-left px-3 py-3 text-base hover:bg-gray-100"
              >
                {item}
              </button>
            ))}
            {items.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">No results</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }

  // Web: Popover fallback
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "h-12 w-full border rounded-md flex justify-between items-center px-3 text-left",
            "text-gray-800 bg-white"
          )}
        >
          {triggerLabel ?? placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-2">
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <ScrollArea className="h-[200px]">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => {
                onSelect(item)
                onOpenChange(false)
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              {item}
            </button>
          ))}
          {items.length === 0 && (
            <div className="p-2 text-center text-sm text-gray-500">No results</div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
