export async function hasGrantedGeolocationPermission(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return false;
  }

  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state === "granted";
  } catch {
    return false;
  }
}
