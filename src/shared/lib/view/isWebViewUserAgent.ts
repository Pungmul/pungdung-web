export const isWebViewUserAgent = (userAgent: string): boolean => {
  const normalizedUserAgent = userAgent.toLowerCase();
  return (
    normalizedUserAgent.includes("react-native") ||
    normalizedUserAgent.includes("wv") ||
    normalizedUserAgent.includes("webview")
  );
};
