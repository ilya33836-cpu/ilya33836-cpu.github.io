import { Header } from './components/Header'
import { AgentWidget } from './components/agent/AgentWidget'
import { Hero } from './components/Hero'
import { ServicesPricing } from './components/ServicesPricing'
import { Projects } from './components/Projects'
import { DemoNotice } from './components/DemoNotice'
import { AIAgent } from './components/AIAgent'
import { WhyMe } from './components/WhyMe'
import { Process } from './components/Process'
import { FAQ } from './components/FAQ'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <main>
        <Hero />
        <ServicesPricing />
        <Projects />
        <DemoNotice />
        <AIAgent />
        <WhyMe />
        <Process />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <AgentWidget />
    </div>
  )
}
