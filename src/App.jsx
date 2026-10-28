import { useState } from 'react'
import MainMenu from './MainMenu'
import NewCityScreen from './NewCityScreen'
import GameScreen from './GameScreen'

function App() {
  const [screen, setScreen] = useState('menu')
  const [cityConfig, setCityConfig] = useState(null)
  const [gameKey, setGameKey] = useState(0)

  if (screen === 'newcity') {
    return (
      <NewCityScreen
        onStart={(config) => {
          setCityConfig(config)
          setGameKey((k) => k + 1)
          setScreen('game')
        }}
        onBack={() => setScreen('menu')}
      />
    )
  }

  if (screen === 'game') {
    return (
      <GameScreen
        key={gameKey}
        config={cityConfig}
        onBack={() => setScreen('menu')}
      />
    )
  }

  return <MainMenu onPlay={() => setScreen('newcity')} />
}

export default App
