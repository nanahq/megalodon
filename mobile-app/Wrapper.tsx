import {
    BatchSize,
    DatadogProvider,
    DatadogProviderConfiguration,
    SdkVerbosity,
    UploadFrequency,
} from "@datadog/mobile-react-native";
import {PropsWithChildren} from "react";
import * as ExpoUpdates from 'expo-updates'

const config = new DatadogProviderConfiguration(
    "pub7666f6b2b52621c78fed7faef7271aee",
    ExpoUpdates.channel?.toLowerCase(),
    "cc9bb2b7-ff8e-4add-a419-31fb77ab37c1",
    true,
    true,
    true
)
config.site = "US1"
config.longTaskThresholdMs = 100
config.nativeCrashReportEnabled = true
config.sampleRate = 100

if (__DEV__) {
    config.uploadFrequency = UploadFrequency.FREQUENT
    config.batchSize = BatchSize.SMALL
    config.verbosity = SdkVerbosity.DEBUG
}

export default function Wrapper({children}: PropsWithChildren<{}>) {
    return (
        <DatadogProvider configuration={config}>
            {children}
        </DatadogProvider>
    );
}
