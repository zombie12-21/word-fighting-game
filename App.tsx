import { GameProvider, useGame } from './store';
import AuthScreen from './AuthScreen';
import GameScreen from './GameScreen';

function Root() {
  const { state } = useGame();
  return state.user ? <GameScreen /> : <AuthScreen />;
}

export default function App() {
  return (
    <GameProvider>
      <Root />
    </GameProvider>
  );
}
