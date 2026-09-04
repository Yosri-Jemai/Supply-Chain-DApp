import "./globals.css";
import { TrackingProvider } from "../Context/Tracking";

import { NavBar, Footer } from "../Components";

export const metadata = {
  title: "Product Tracking Dapp",
  description: "Product Tracking Dapp on Ethereum",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TrackingProvider>
        <NavBar />
          {children}
        </TrackingProvider>
        <Footer />
      </body>
    </html>
  );
}