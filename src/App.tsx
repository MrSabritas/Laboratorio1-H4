import ColorHarmonizer from './components/ColorHarmonizer'
import RandomColor3D from './components/RandomColor3D'
import './styles/App.scss'

function App() {
  return (
    <div className="app-container">
      <h1>Teoría del Color HSL</h1>
      <ColorHarmonizer />
      <RandomColor3D />
    </div>
  )
}

export default App
