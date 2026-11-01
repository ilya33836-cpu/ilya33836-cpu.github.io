import { lazy, Suspense, useEffect } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'

/**
 * Первый экран весит заметно меньше остальной страницы, поэтому всё, что ниже
 * сгиба, грузится отдельными чанками: по скроллу или в простое браузера.
 * К моменту, когда посетитель доскроллит или нажмёт ссылку в меню, всё уже готово.
 */
const BelowFold = lazy(() =>
  import('./components/BelowFold').then((m) => ({ default: m.BelowFold })),
)

/** Заглушка на время загрузки чанка, сохраняет высоту и якоря секций. */
function Placeholder({ height = 640 }: { height?: number }) {
  return <div style={{ minHeight: height }} aria-hidden="true" />
}

export default function App() {
  useEffect(() => {
    const warm = () => {
      void import('./components/BelowFold')
    }

    // Подгружаем заранее: по первому касанию/прокрутке и в простое.
    const idle = window.requestIdleCallback
    if (typeof idle === 'function') idle(warm, { timeout: 2000 })
    else window.setTimeout(warm, 1200)

    const onFirstScroll = () => {
      warm()
      window.removeEventListener('scroll', onFirstScroll)
    }
    window.addEventListener('scroll', onFirstScroll, { passive: true, once: true })
  }, [])

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<Placeholder height={1200} />}>
          <BelowFold />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}