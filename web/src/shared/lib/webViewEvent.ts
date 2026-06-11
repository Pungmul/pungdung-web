export const sendWebViewEvent = (event: string, data: unknown) => {
    if (typeof window !== 'undefined' && (window as unknown as { ReactNativeWebView: { postMessage: (message: string) => void } }).ReactNativeWebView) {
        (window as unknown as { ReactNativeWebView: { postMessage: (message: string) => void } }).ReactNativeWebView.postMessage(
            JSON.stringify({ event, data })
        );
    } else {
        console.warn('ReactNativeWebView is not available');
    }
};