import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'React 2026 Q2',
  description: 'My App for RS School couse',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
} 