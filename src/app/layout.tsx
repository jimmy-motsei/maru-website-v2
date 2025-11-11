import './globals.css'
import { Mulish } from 'next/font/google'

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['600','700'],
  display: 'swap',
  variable: '--font-display',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mulish.variable}>
      <body>{children}</body>
    </html>
  )
}