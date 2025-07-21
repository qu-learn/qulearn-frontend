
import type React from "react"

const CircuitSimulator: React.FC = () => {
  return (
    <iframe
      src="/CircuitSimulator.html"
      style={{
        width: "100%",
        height: "calc(100vh - 80px)",
        border: "none",
      }}
    />
  )
}

export default CircuitSimulator
