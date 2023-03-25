import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components/native";
import { SafeArea } from "./src/infrastructure/components/utility/safe-area.component";
import { theme } from "./src/infrastructure/theme";
import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
import { Wrapper } from "./src/infrastructure/components/wrappper/wrapper";
import Index from "./src/features/navigation";

import { AuthenticationContextProvider } from "./src/features/authentication/authenticationContext";
import { UserInfoContextProvider } from "./src/features/userInfo/UserInfoContext";
import { ProfilesContextProvider } from "./src/features/Profiles/ProfilesContext";

export default function App() {
  const [oswaldLoaded] = useOswald({
    Oswald_400Regular,
  });

  const [latoLoaded] = useLato({
    Lato_400Regular,
  });

  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <ProfilesContextProvider>
      <AuthenticationContextProvider>
        <UserInfoContextProvider>
        <Wrapper>
          <SafeArea>
            <Index />
            <StatusBar style="light" />
          </SafeArea>
        </Wrapper>
        </UserInfoContextProvider>
      </AuthenticationContextProvider>
      </ProfilesContextProvider>
    </ThemeProvider>
  );
}
