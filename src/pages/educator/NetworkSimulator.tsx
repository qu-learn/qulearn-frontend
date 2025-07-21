
import type React from "react"

const NetworkSimulator: React.FC = () => {
  return (
    <iframe
      src="/NetworkSimulator.html"
      style={{
        width: "100%",
        height: "calc(100vh - 80px)",
        border: "none",
      }}
    />
  )
}

export default NetworkSimulator
