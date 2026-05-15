import Image from 'next/image'
import { MARQUEE_IMAGES } from '@/lib/showcaseImages'

export function Marquee() {
  const loop = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES]

  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden bg-creme-100 py-10 border-y border-creme-200"
    >
      <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-creme-100 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-creme-100 to-transparent pointer-events-none" />

      <div className="flex marquee-track gap-5 w-max">
        {loop.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-32 md:h-44 w-32 md:w-44 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm bg-creme-50"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="180px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
