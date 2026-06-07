import Scene from '@/components/Scene'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      {/* 3D Background canvas layer */}
      <Scene />
      
      {/* Scrollable layout contents */}
      <Hero />
    </main>
  )
}
