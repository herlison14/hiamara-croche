interface FlowerBackgroundProps {
  image?: string
  opacity?: number
  blur?: number
}

export function FlowerBackground({
  image = '/flowers/roses-bg.webp',
  opacity = 0.15,
  blur = 3,
}: FlowerBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url('${image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity,
        filter: `blur(${blur}px)`,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
