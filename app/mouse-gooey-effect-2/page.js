import dynamic from 'next/dynamic'
import './css/style.css'
import ThreeCanvas from './components/ThreeCanvas'

const ThreeCanvas = dynamic(() => import('./components/ThreeCanvas'), {
  ssr: false,
})

export default function Page() {
  return (
    <div className="demo-1">
      <section className="content | scrollarea-ctn">
        <div className="scrollarea | slideshow">
          <ul className="slideshow-list">
            <li className="slideshow-list__el"></li>
            <li className="slideshow-list__el"></li>
            <li className="slideshow-list__el"></li>
            <li className="slideshow-list__el"></li>
          </ul>
        </div>
      </section>

      <ThreeCanvas />
    </div>
  )
}