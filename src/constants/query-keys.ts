export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"] as const,
  },
  USERS: {
    ALL: (params?: unknown) => ["users", params] as const,
    DETAIL: (id: string) => ["users", id] as const,
    STATS: ["users", "admin", "stats"] as const,
  },
  SEMESTERS: {
    ALL: (params?: unknown) => ["semesters", params] as const,
    DETAIL: (id: string) => ["semesters", id] as const,
  },
  COURSES: {
    ALL: (params?: unknown) => ["courses", params] as const,
    DETAIL: (id: string) => ["courses", id] as const,
  },
  COURSE_OFFERINGS: {
    ALL: (params?: unknown) => ["course-offerings", params] as const,
    DETAIL: (id: string) => ["course-offerings", id] as const,
  },
  ENROLLMENTS: {
    ALL: (params?: unknown) => ["enrollments", params] as const,
    MY: ["enrollments", "my"] as const,
    OFFERING: (id: string) => ["enrollments", "offering", id] as const,
  },
  PAYMENTS: {
    ALL: (params?: unknown) => ["payments", params] as const,
    MY: ["payments", "my"] as const,
  },
  RESULTS: {
    ALL: (params?: unknown) => ["results", params] as const,
    MY: ["results", "my"] as const,
  },
  AUDIT: {
    ALL: (params?: unknown) => ["audit-logs", params] as const,
  },
} as const;
