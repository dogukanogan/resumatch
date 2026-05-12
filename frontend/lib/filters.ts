export const WORK_MODE_OPTIONS = [
  { value: "onsite", label: "On-site" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
] as const

export const JOB_TYPE_OPTIONS = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "internship", label: "Internship" },
  { value: "volunteer", label: "Volunteer" },
  { value: "freelance", label: "Freelance" },
] as const

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: "internship", label: "Internship" },
  { value: "entry", label: "Entry level" },
  { value: "associate", label: "Associate" },
  { value: "mid_senior", label: "Mid-Senior level" },
  { value: "director", label: "Director" },
  { value: "executive", label: "Executive" },
] as const

export const DATE_POSTED_OPTIONS = [
  { value: "any_time", label: "Any time" },
  { value: "past_month", label: "Past month" },
  { value: "past_week", label: "Past week" },
  { value: "past_24h", label: "Past 24 hours" },
] as const

export type WorkMode = typeof WORK_MODE_OPTIONS[number]["value"]
export type JobType = typeof JOB_TYPE_OPTIONS[number]["value"]
export type ExperienceLevel = typeof EXPERIENCE_LEVEL_OPTIONS[number]["value"]
export type DatePosted = typeof DATE_POSTED_OPTIONS[number]["value"]

export interface JobFilters {
  query: string
  country: string
  city: string
  work_mode: WorkMode[]
  job_type: JobType[]
  experience_level: ExperienceLevel[]
  date_posted: DatePosted | ""
  salary_min: string
  salary_max: string
}

export const defaultFilters: JobFilters = {
  query: "",
  country: "",
  city: "",
  work_mode: [],
  job_type: [],
  experience_level: [],
  date_posted: "",
  salary_min: "",
  salary_max: "",
}
