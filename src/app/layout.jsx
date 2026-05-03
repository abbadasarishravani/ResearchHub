import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { PaperProvider } from "@/context/PaperContext";

export const metadata = {
    title: "ResearchHub AI - AI-Powered Research Management Platform",
    description: "Collaborative research platform with AI-powered tools for paper management, review, and analysis",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <PaperProvider>
              {children}
            </PaperProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>);
}
