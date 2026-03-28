import RootInit from '@core/init/RootInit';
import AuthGuard from '@shared/components/providers/AuthGuard';

import './globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootInit /> {/* 🔥 new system */}

        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}