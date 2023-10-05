import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";
import CaptionExtension from "./components/CaptionExtension";
import { track } from "./gainsight";

function App() {
  useEffect(() => {
    const ddToken = process.env.REACT_APP_DATADOG_TOKEN;
    const ddAppId = process.env.REACT_APP_DATADOG_APP_ID;
    const ddEnv = process.env.REACT_APP_DATADOG_ENV_ID;
    const version = process.env.REACT_APP_VERSION || "0.1.0";

    if (ddToken && ddAppId && ddEnv) {
      datadogRum.init({
        applicationId: ddAppId,
        clientToken: ddToken,
        env: ddEnv,
        site: "datadoghq.com",
        service: "dc-extension-ai-image-caption",
        version,
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: true,
        defaultPrivacyLevel: "allow",
        sampleRate: 100,
        useCrossSiteSessionCookie: true,
      });

      datadogRum.startSessionReplayRecording();
    }
    track(window, "AI Captioning");
  }, []);

  return <CaptionExtension />;
}

export default App;
