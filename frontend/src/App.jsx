import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#242424] text-white text-center">
      {/* Logos */}
      <div className="flex items-center justify-center gap-8 mb-6">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            className="w-28 hover:drop-shadow-[0_0_2em_#646cffaa] transition duration-300"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="w-28 animate-spin-slow hover:drop-shadow-[0_0_2em_#61dafbaa] transition duration-300"
            alt="React logo"
          />
        </a>
      </div>

      {/* Título */}
      <h1 className="text-5xl font-bold mb-8">
        Vite + <span className="text-sky-400">React</span>
      </h1>

      {/* Card */}
      <div className="card bg-[#1a1a1a] p-8 rounded-xl shadow-lg">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-[#1a1a1a] border border-gray-700 hover:border-sky-500 text-white py-2 px-6 rounded-lg transition"
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-300">
          Edit <code className="bg-gray-800 px-1 py-0.5 rounded font-mono">src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* Footer */}
      <p className="mt-10 text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
