import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, ImageIcon, Settings, LogOut } from 'lucide-react'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/configuracoes', label: 'Config', icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')

  if (!token || token.value !== 'valid') {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex">
      <aside className="hidden md:flex w-56 flex-col bg-white border-r border-[#EDE0CD] fixed inset-y-0">
        <div className="p-6 border-b border-[#EDE0CD]">
          <h2 className="text-lg font-light text-[#3D2B2B]" style={{ fontFamily: 'Cormorant Garamond' }}>
            HIAMARA <em>CROCHÊ</em>
          </h2>
          <p className="text-[10px] text-[#8A7B7B] uppercase tracking-widest mt-0.5">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#5C4A4A] hover:bg-[#F5EFE6] hover:text-[#C97A84] transition-colors group"
            >
              <Icon size={16} className="group-hover:text-[#C97A84]" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#EDE0CD]">
          <form action="/api/admin/auth" method="DELETE">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8A7B7B] hover:text-red-400 transition-colors"
            >
              <LogOut size={16} /> Sair
            </Link>
          </form>
        </div>
      </aside>

      <div className="md:ml-56 flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-[#EDE0CD] px-6 py-4 flex items-center justify-between md:justify-end">
          <span className="md:hidden text-sm font-medium text-[#3D2B2B]">HIAMARA CROCHÊ</span>
          <Link href="/" className="text-xs text-[#8A7B7B] hover:text-[#C97A84]">← Ver Loja</Link>
        </header>

        <main className="flex-1 p-6">{children}</main>

        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#EDE0CD] flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center py-3 text-[#8A7B7B] hover:text-[#C97A84] gap-1">
              <Icon size={18} />
              <span className="text-[9px] uppercase tracking-wider">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
