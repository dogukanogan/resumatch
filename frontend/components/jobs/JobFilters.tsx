"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  WORK_MODE_OPTIONS,
  JOB_TYPE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  DATE_POSTED_OPTIONS,
  JobFilters,
  defaultFilters,
  WorkMode,
  JobType,
  ExperienceLevel,
} from "@/lib/filters"

interface Props {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
}

function CheckGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: readonly { value: T; label: string }[]
  selected: T[]
  onToggle: (value: T) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-300">{label}</p>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt.value)
          return (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  active
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-slate-600 group-hover:border-slate-400"
                }`}
                onClick={() => onToggle(opt.value)}
              >
                {active && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                {opt.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default function JobFiltersPanel({ filters, onChange }: Props) {
  const toggle = <T extends string>(key: keyof JobFilters, value: T) => {
    const current = filters[key] as T[]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const activeCount =
    filters.work_mode.length +
    filters.job_type.length +
    filters.experience_level.length +
    (filters.date_posted ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.salary_min ? 1 : 0) +
    (filters.salary_max ? 1 : 0)

  return (
    <aside className="w-64 shrink-0 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={() => onChange(defaultFilters)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-300">Location</p>
        <Input
          placeholder="Country"
          value={filters.country}
          onChange={(e) => onChange({ ...filters, country: e.target.value })}
          className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 h-8 text-sm"
        />
        <Input
          placeholder="City"
          value={filters.city}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 h-8 text-sm"
        />
      </div>

      <Separator className="bg-slate-700" />

      <CheckGroup
        label="Work Mode"
        options={WORK_MODE_OPTIONS}
        selected={filters.work_mode}
        onToggle={(v) => toggle<WorkMode>("work_mode", v)}
      />

      <Separator className="bg-slate-700" />

      <CheckGroup
        label="Job Type"
        options={JOB_TYPE_OPTIONS}
        selected={filters.job_type}
        onToggle={(v) => toggle<JobType>("job_type", v)}
      />

      <Separator className="bg-slate-700" />

      <CheckGroup
        label="Experience Level"
        options={EXPERIENCE_LEVEL_OPTIONS}
        selected={filters.experience_level}
        onToggle={(v) => toggle<ExperienceLevel>("experience_level", v)}
      />

      <Separator className="bg-slate-700" />

      {/* Date posted */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-300">Date Posted</p>
        <div className="space-y-1.5">
          {DATE_POSTED_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  filters.date_posted === opt.value
                    ? "border-indigo-600"
                    : "border-slate-600 group-hover:border-slate-400"
                }`}
                onClick={() =>
                  onChange({
                    ...filters,
                    date_posted: filters.date_posted === opt.value ? "" : opt.value,
                  })
                }
              >
                {filters.date_posted === opt.value && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </div>
              <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Salary */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-300">Salary (USD / year)</p>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={filters.salary_min}
            onChange={(e) => onChange({ ...filters, salary_min: e.target.value })}
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 h-8 text-sm"
          />
          <Input
            placeholder="Max"
            type="number"
            value={filters.salary_max}
            onChange={(e) => onChange({ ...filters, salary_max: e.target.value })}
            className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500 h-8 text-sm"
          />
        </div>
      </div>
    </aside>
  )
}
