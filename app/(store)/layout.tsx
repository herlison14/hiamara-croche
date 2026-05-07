import Footer from '@/components/layout/Footer'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  )
}
