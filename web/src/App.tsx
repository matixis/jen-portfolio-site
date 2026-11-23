import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Intro, Marquee, Stats, WorkIndex } from './components/Bands'
import { ThinkLounge } from './components/ThinkLounge'
import { BeechNut, MoreWork } from './components/BeechNut'
import { Contact, Experience, Toolbox } from './components/Experience'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Intro />
        <WorkIndex />
        <ThinkLounge />
        <BeechNut />
        <MoreWork />
        <Experience />
        <Toolbox />
        <Contact />
      </main>
    </>
  )
}
