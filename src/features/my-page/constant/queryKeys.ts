export const myPageQueryKeys = {
  all: ["my-page"] as const,
  info: () => [...myPageQueryKeys.all, "info"] as const,
};
