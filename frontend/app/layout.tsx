import { AuthProvider } from "../context/AuthContext";
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}