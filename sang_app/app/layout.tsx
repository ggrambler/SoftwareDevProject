
import { Providers } from "./provider";
import "./globals.css";
import favicon from "@/public/favicon.png"; 


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

  <head>
  <link rel="icon" type="image/png" href={favicon.src} />
        <title>VidTeams</title>
      </head>
      
        <body>
          
        <Providers>
          {children}
        </Providers>
        </body>
      </html>
  );
}

