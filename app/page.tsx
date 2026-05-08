import Link from 'next/link'
import { CinematicHero } from '@/components/cinematicHero'
import { CinematicSection } from '@/components/cinematicSection'
import { CinematicTransition, StaggerContainer, StaggerItem } from '@/components/cinematicTransition'
import { ProdutosColecao } from '@/components/produtosColecao'

const BENEFITS = [
  { icon: '✋', title: 'Feito à Mão', description: 'Cada peça é crafted com dedicação e cuidado artesanal' },
  { icon: '💚', title: 'Entregue com Amor', description: 'Enviamos com todo carinho, protegendo sua preciosidade' },
  { icon: '♻️', title: 'Sustentável', description: 'Usando fios de qualidade e práticas eco-friendly' },
]

export default function Home() {
  return (
    <main className="bg-creme-50">
      {/* Hero cinematográfico */}
      <CinematicHero />

      {/* Seção: Apresentação da marca */}
      <CinematicSection
        id="about"
        title="Sobre Nós"
        subtitle="Cada peça conta uma história de dedicação e carinho"
        variant="light"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <CinematicTransition delay={0.2}>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-creme-100 to-creme-200">
              {/* Placeholder para imagem */}
              <div className="w-full h-full flex items-center justify-center text-texto-claro">
                <p className="text-center">Imagem artesanal</p>
              </div>
            </div>
          </CinematicTransition>

          <CinematicTransition delay={0.4}>
            <div className="space-y-6">
              <p className="text-lg text-texto-medio font-light leading-relaxed">
                HIAMARA CROCHÊ é uma pequena produção de artesanato dedicada à criação de peças
                únicas em crochê. Cada item é confeccionado à mão com os melhores fios,
                refletindo a paixão e dedicação pelo ofício tradicional.
              </p>
              <p className="text-lg text-texto-medio font-light leading-relaxed">
                Acreditamos que a beleza está nos detalhes e que cada peça merece atenção especial.
                Por isso, não produzimos em massa — cada crochê é pensado para durar gerações.
              </p>
              <Link href="/categorias" className="inline-block bg-rosa-400 hover:bg-rosa-500 text-white px-8 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm transition-colors">
                Ver Produtos
              </Link>
            </div>
          </CinematicTransition>
        </div>
      </CinematicSection>

      {/* Seção: Produtos em destaque */}
      <CinematicSection
        id="produtos"
        title="Coleção Premium"
        subtitle="Conheça nossos trabalhos mais procurados"
        variant="light"
        parallaxIntensity={30}
      >
        <ProdutosColecao />
      </CinematicSection>

      {/* Seção: Por que escolher HIAMARA */}
      <CinematicSection
        id="benefits"
        title="Por Que Escolher Hiamara?"
        variant="light"
        parallaxIntensity={40}
      >
        <StaggerContainer staggerDelay={0.15}>
          <div className="grid md:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, index) => (
              <StaggerItem key={index}>
                <div className="text-center p-8 rounded-xl bg-creme-100/50 border border-creme-200 hover:border-rosa-300 transition-colors">
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-2xl font-semibold text-texto-escuro mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-texto-medio font-light">{benefit.description}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </CinematicSection>

      {/* Seção: CTA Final */}
      <CinematicSection
        id="cta"
        title="Pronto para Sua Próxima Peça?"
        subtitle="Explore nossa coleção completa e encontre a perfeição"
        variant="light"
      >
        <div className="text-center">
          <CinematicTransition delay={0.3}>
            <Link href="/categorias" className="bg-rosa-400 hover:bg-rosa-500 text-white px-16 py-4 rounded-lg font-semibold uppercase tracking-widest text-lg transition-colors inline-block">
              Ver Todos Produtos
            </Link>
          </CinematicTransition>
        </div>
      </CinematicSection>

      {/* Footer simples */}
      <footer className="bg-creme-100 border-t border-creme-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-texto-medio">
          <p className="font-light">© 2024 HIAMARA CROCHÊ — Feito à mão, entregue com amor</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="https://www.instagram.com/hiamaracroche" target="_blank" rel="noopener noreferrer" className="hover:text-rosa-400 transition-colors">Instagram</a>
            <a href="https://wa.me/5521997927927" target="_blank" rel="noopener noreferrer" className="hover:text-rosa-400 transition-colors">WhatsApp</a>
            <Link href="/categorias" className="hover:text-rosa-400 transition-colors">Produtos</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
