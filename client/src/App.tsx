import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Desktop from "@/components/win95/Desktop";
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { styleReset } from 'react95';
import original from 'react95/dist/themes/original';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
`;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={original}>
        <GlobalStyles />
        <TooltipProvider>
          <Toaster />
          <Desktop />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
