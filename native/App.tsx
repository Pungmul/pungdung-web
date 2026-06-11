import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const FALLBACK_WEB_URL = "https://pungdung.site";
const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? FALLBACK_WEB_URL;

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <WebView source={{ uri: WEB_URL }} style={styles.webview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  webview: {
    flex: 1,
  },
});
