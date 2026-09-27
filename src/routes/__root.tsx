import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteShell } from "@/components/site-shell";
import appCss from "../styles.css?url";

const APP_NAME = "Swamp Force";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME}` },
      {
        name: "description",
        content:
          "Both parties failed. They do not represent the American people. No surplus since Clinton. Fraud door open.",
      },
      { name: "theme-color", content: "#0b0b0b" },
      { name: "author", content: "SwampForce Editor" },
      { property: "og:url", content: "https://swampforce.grok.me/" },
      { property: "og:title", content: "Both parties failed. — Swamp Force" },
      {
        property: "og:description",
        content:
          "They do not represent the American people. Congress holds the money. The blame game is politics.",
      },
      {
        property: "og:image",
        content: "https://swampforce.grok.me/og.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Both parties failed. — Swamp Force" },
      { name: "twitter:site", content: "@SwampForce" },
      { name: "twitter:creator", content: "@SwampForce" },
      {
        name: "twitter:image",
        content: "https://swampforce.grok.me/og.jpg",
      },
      { property: "x:creator", content: "@SwampForce" },
      { property: "x:creator:id", content: "2022864363426824192" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon-32.png" },
      { rel: "apple-touch-icon", href: "/icon-180.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <SiteShell>
            <Outlet />
          </SiteShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
