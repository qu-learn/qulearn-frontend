"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Save, Play, RotateCcw } from "lucide-react"
import { useParams } from "react-router-dom"
import { useGetCircuitsQuery, useCreateCircuitMutation, useUpdateCircuitMutation, useGetCircuitQuery } from "../api"

interface Gate {
  id: string
  type: string
  position: { x: number; y: number }
  qubit: number
  controlQubit?: number
}

interface CircuitState {
  gates: Gate[]
  qubits: number
  results?: number[]
}

const GATE_TYPES = [
  { type: "H", name: "Hadamard", color: "bg-blue-500" },
  { type: "X", name: "Pauli-X", color: "bg-red-500" },
  { type: "Y", name: "Pauli-Y", color: "bg-green-500" },
  { type: "Z", name: "Pauli-Z", color: "bg-purple-500" },
  { type: "CNOT", name: "CNOT", color: "bg-orange-500" },
  { type: "S", name: "S Gate", color: "bg-pink-500" },
  { type: "T", name: "T Gate", color: "bg-indigo-500" },
]

const CircuitSimulator: React.FC = () => {
  const { circuitId } = useParams<{ circuitId?: string }>()
  const [circuitState, setCircuitState] = useState<CircuitState>({
    gates: [],
    qubits: 3,
  })
  const [selectedGate, setSelectedGate] = useState<string | null>(null)
  const [circuitName, setCircuitName] = useState("New Circuit")
  const [draggedGate, setDraggedGate] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { data: circuitsData } = useGetCircuitsQuery()
  const { data: circuitData } = useGetCircuitQuery(circuitId || "", { skip: !circuitId })
  const [createCircuit] = useCreateCircuitMutation()
  const [updateCircuit] = useUpdateCircuitMutation()

  useEffect(() => {
    if (circuitData) {
      setCircuitState(circuitData.circuit.configuration)
      setCircuitName(circuitData.circuit.name)
    }
  }, [circuitData])

  useEffect(() => {
    drawCircuit()
  }, [circuitState])

  const drawCircuit = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw qubit lines
    const qubitSpacing = 80
    const startY = 60

    for (let i = 0; i < circuitState.qubits; i++) {
      const y = startY + i * qubitSpacing
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50, y)
      ctx.lineTo(canvas.width - 50, y)
      ctx.stroke()

      // Qubit labels
      ctx.fillStyle = "#374151"
      ctx.font = "16px Arial"
      ctx.fillText(`|${i}⟩`, 10, y + 5)
    }

    // Draw gates
    circuitState.gates.forEach((gate) => {
      const y = startY + gate.qubit * qubitSpacing

      if (gate.type === "CNOT") {
        // Draw CNOT gate
        const controlY = startY + (gate.controlQubit || 0) * qubitSpacing

        // Control dot
        ctx.fillStyle = "#374151"
        ctx.beginPath()
        ctx.arc(gate.position.x, controlY, 8, 0, 2 * Math.PI)
        ctx.fill()

        // Connection line
        ctx.strokeStyle = "#374151"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(gate.position.x, controlY)
        ctx.lineTo(gate.position.x, y)
        ctx.stroke()

        // Target circle
        ctx.strokeStyle = "#374151"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(gate.position.x, y, 15, 0, 2 * Math.PI)
        ctx.stroke()

        // Target cross
        ctx.beginPath()
        ctx.moveTo(gate.position.x - 10, y)
        ctx.lineTo(gate.position.x + 10, y)
        ctx.moveTo(gate.position.x, y - 10)
        ctx.lineTo(gate.position.x, y + 10)
        ctx.stroke()
      } else {
        // Draw single qubit gate
        const gateInfo = GATE_TYPES.find((g) => g.type === gate.type)
        ctx.fillStyle = gateInfo?.color.replace("bg-", "#") || "#3B82F6"
        ctx.fillRect(gate.position.x - 20, y - 20, 40, 40)

        ctx.fillStyle = "white"
        ctx.font = "16px Arial"
        ctx.textAlign = "center"
        ctx.fillText(gate.type, gate.position.x, y + 5)
      }
    })
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedGate) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Determine which qubit line was clicked
    const qubitSpacing = 80
    const startY = 60
    const qubit = Math.round((y - startY) / qubitSpacing)

    if (qubit >= 0 && qubit < circuitState.qubits) {
      const newGate: Gate = {
        id: Date.now().toString(),
        type: selectedGate,
        position: { x, y: startY + qubit * qubitSpacing },
        qubit,
      }

      // For CNOT gates, set control qubit (simplified logic)
      if (selectedGate === "CNOT" && qubit > 0) {
        newGate.controlQubit = qubit - 1
      }

      setCircuitState((prev) => ({
        ...prev,
        gates: [...prev.gates, newGate],
      }))
    }
  }

  const simulateCircuit = () => {
    // Simplified quantum simulation
    const numStates = Math.pow(2, circuitState.qubits)
    const results = new Array(numStates).fill(0)

    // For demonstration, just show random results
    for (let i = 0; i < 1000; i++) {
      const randomState = Math.floor(Math.random() * numStates)
      results[randomState]++
    }

    setCircuitState((prev) => ({ ...prev, results }))
  }

  const saveCircuit = async () => {
    try {
      if (circuitId) {
        await updateCircuit({
          circuitId,
          name: circuitName,
          configuration: circuitState,
        }).unwrap()
      } else {
        await createCircuit({
          name: circuitName,
          configuration: circuitState,
        }).unwrap()
      }
    } catch (error) {
      console.error("Failed to save circuit:", error)
    }
  }

  const clearCircuit = () => {
    setCircuitState((prev) => ({ ...prev, gates: [], results: undefined }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quantum Circuit Simulator</h1>
        <p className="text-gray-600">Build and simulate quantum circuits with drag-and-drop interface</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Gate Palette */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gate Palette</h3>
            <div className="space-y-2">
              {GATE_TYPES.map((gate) => (
                <button
                  key={gate.type}
                  onClick={() => setSelectedGate(gate.type)}
                  className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${
                    gate.color
                  } ${selectedGate === gate.type ? "ring-2 ring-blue-500" : ""}`}
                >
                  {gate.name} ({gate.type})
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Circuit Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Circuit Name</label>
                  <input
                    type="text"
                    value={circuitName}
                    onChange={(e) => setCircuitName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Qubits</label>
                  <select
                    value={circuitState.qubits}
                    onChange={(e) => setCircuitState((prev) => ({ ...prev, qubits: Number.parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Qubits
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Circuit Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Circuit Designer</h3>
              <div className="flex space-x-2">
                <button
                  onClick={simulateCircuit}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </button>
                <button
                  onClick={clearCircuit}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </button>
                <button
                  onClick={saveCircuit}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                onClick={handleCanvasClick}
                className="w-full cursor-crosshair"
              />
            </div>

            {selectedGate && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Selected: <strong>{selectedGate}</strong> - Click on a qubit line to place the gate
                </p>
              </div>
            )}
          </div>

          {/* Results */}
          {circuitState.results && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Simulation Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {circuitState.results.map((count, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">
                      |{index.toString(2).padStart(circuitState.qubits, "0")}⟩
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(count / 1000) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CircuitSimulator
