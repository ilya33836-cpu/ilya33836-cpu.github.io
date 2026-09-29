import { ServicesPricing } from './ServicesPricing'
import { Projects } from './Projects'
import { DemoNotice } from './DemoNotice'
import { WhyMe } from './WhyMe'
import { Process } from './Process'
import { FAQ } from './FAQ'
import { Contact } from './Contact'

/**
 * Секции ниже первого экрана собраны в один отдельный чанк: первый экран
 * грузится без них, а этот код приезжает при первом скролле или в простое.
 */
export function BelowFold() {
  return (
    <>
      <ServicesPricing />
      <Projects />
      <DemoNotice />
      <WhyMe />
      <Process />
      <FAQ />
      <Contact />
    </>
  )
}
