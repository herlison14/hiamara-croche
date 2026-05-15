import { Suspense } from 'react'
import { HeroEditorial } from '@/components/home/HeroEditorial'
import { Marquee } from '@/components/home/Marquee'
import { CategoriasGrid } from '@/components/home/CategoriasGrid'
import { VitrineDestaque } from '@/components/home/VitrineDestaque'
import { NossoProcesso } from '@/components/home/NossoProcesso'
import { AboutBlock } from '@/components/home/AboutBlock'
import { Depoimentos } from '@/components/home/Depoimentos'
import { CtaFinal } from '@/components/home/CtaFinal'
import Footer from '@/components/layout/Footer'

function VitrineSkeleton() {
  return (
    <section className="bg-creme-50 py-20 md:py-28">
      <div className="container-wide">
        <div className="mb-12 space-y-3">
          <div className="h-3 w-24 bg-creme-200 rounded animate-pulse" />
          <div className="h-10 w-72 bg-creme-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-2xl bg-creme-100 shimmer"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="bg-creme-50">
      <HeroEditorial />
      <Marquee />
      <CategoriasGrid />
      <Suspense fallback={<VitrineSkeleton />}>
        <VitrineDestaque />
      </Suspense>
      <NossoProcesso />
      <AboutBlock />
      <Depoimentos />
      <CtaFinal />
      <Footer />
    </main>
  )
}
