import { AuthProvider } from "../context/AuthContext";
import AuthGuard from "@/components/providers/AuthGuard";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}