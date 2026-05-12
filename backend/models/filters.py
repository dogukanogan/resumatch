from enum import Enum


class WorkMode(str, Enum):
    ONSITE = "onsite"
    REMOTE = "remote"
    HYBRID = "hybrid"


class JobType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    TEMPORARY = "temporary"
    INTERNSHIP = "internship"
    VOLUNTEER = "volunteer"
    FREELANCE = "freelance"


class ExperienceLevel(str, Enum):
    INTERNSHIP = "internship"
    ENTRY = "entry"
    ASSOCIATE = "associate"
    MID_SENIOR = "mid_senior"
    DIRECTOR = "director"
    EXECUTIVE = "executive"


class DatePosted(str, Enum):
    ANY_TIME = "any_time"
    PAST_MONTH = "past_month"
    PAST_WEEK = "past_week"
    PAST_24H = "past_24h"


WORK_MODE_LABELS = {
    WorkMode.ONSITE: "On-site",
    WorkMode.REMOTE: "Remote",
    WorkMode.HYBRID: "Hybrid",
}

JOB_TYPE_LABELS = {
    JobType.FULL_TIME: "Full-time",
    JobType.PART_TIME: "Part-time",
    JobType.CONTRACT: "Contract",
    JobType.TEMPORARY: "Temporary",
    JobType.INTERNSHIP: "Internship",
    JobType.VOLUNTEER: "Volunteer",
    JobType.FREELANCE: "Freelance",
}

EXPERIENCE_LEVEL_LABELS = {
    ExperienceLevel.INTERNSHIP: "Internship",
    ExperienceLevel.ENTRY: "Entry level",
    ExperienceLevel.ASSOCIATE: "Associate",
    ExperienceLevel.MID_SENIOR: "Mid-Senior level",
    ExperienceLevel.DIRECTOR: "Director",
    ExperienceLevel.EXECUTIVE: "Executive",
}

DATE_POSTED_LABELS = {
    DatePosted.ANY_TIME: "Any time",
    DatePosted.PAST_MONTH: "Past month",
    DatePosted.PAST_WEEK: "Past week",
    DatePosted.PAST_24H: "Past 24 hours",
}
