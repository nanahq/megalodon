import {persistence} from "@api/persistence";
import * as Updates from "expo-updates";

export async function clearOnAuthError (): Promise<void> {
    await persistence.deleteSecure()
    await Updates.reloadAsync()
}
