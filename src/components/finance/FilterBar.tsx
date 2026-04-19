import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { FilterState, DatePreset } from "@/lib/finance-filter";

type Props = {
  filter: FilterState;
  onChange: (f: FilterState) => void;
};

const presets: { value: DatePreset; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "this_month", label: "Bulan Ini" },
  { value: "last_month", label: "Bulan Lalu" },
  { value: "custom", label: "Custom" },
];

export function FilterBar({ filter, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-3 shadow-card-soft ring-1 ring-border/60 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant={filter.preset === p.value ? "default" : "outline"}
            onClick={() => onChange({ ...filter, preset: p.value })}
            className={cn("rounded-full", filter.preset === p.value && "bg-primary text-primary-foreground")}
          >
            {p.label}
          </Button>
        ))}
      </div>
      {filter.preset === "custom" && (
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn(!filter.from && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filter.from ? format(filter.from, "dd-MM-yyyy") : "Dari"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filter.from}
                onSelect={(d) => onChange({ ...filter, from: d })}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn(!filter.to && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filter.to ? format(filter.to, "dd-MM-yyyy") : "Sampai"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filter.to}
                onSelect={(d) => onChange({ ...filter, to: d })}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
