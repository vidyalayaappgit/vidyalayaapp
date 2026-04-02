import RootInit from '@core/init/RootInit';
import AuthGuard from '@shared/components/providers/AuthGuard';
import PageLayout from './PageLayout';  // Import the new PageLayout

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
        <RootInit />
        <AuthGuard>
          <PageLayout>  {/* Wrap with PageLayout */}
            {children}
          </PageLayout>
        </AuthGuard>
      </body>
    </html>
  );
}