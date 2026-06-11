export const locationQueryKeys = {
  all: ["location"] as const,
  user: () => [...locationQueryKeys.all, "user"] as const,
};

