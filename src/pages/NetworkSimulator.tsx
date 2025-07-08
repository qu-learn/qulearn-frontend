"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Save, Play, RotateCcw } from "lucide-react"
import { useParams } from "react-router-dom"
import { useGetNetworksQuery, useCreateNetworkMutation, useUpdateNetworkMutation, useGetNetworkQuery } from "../api"

interface NetworkNode {
  id: string
  position: { x: number; y: number }
  type: "quantum" | "classical"
  label: string
}

interface NetworkConnection {
  id: string
  from: string
  to: string
  type: "quantum" | "classical"
}

interface NetworkState {
  nodes: NetworkNode[]
  connections: NetworkConnection[]
  eprPairs: { nodeA: string; nodeB: string }[]
}

const NetworkSimulator: React.FC = () => {
  const { networkId } = useParams<{ networkId?: string }>()
  const [networkState, setNetworkState] = useState<NetworkState>({
    nodes: [],
    connections: [],
    eprPairs: [],
  })
  const [selectedTool, setSelectedTool] = useState<"node" | "connection" | "epr" | null>("node")
  const [networkName, setNetworkName] = useState("New Network")
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { data: networksData } = useGetNetworksQuery()
  const { data: networkData } = useGetNetworkQuery(networkId || "", { skip: !networkId })
  const [createNetwork] = useCreateNetworkMutation()
  const [updateNetwork] = useUpdateNetworkMutation()

  useEffect(() => {
    if (networkData) {
      setNetworkState(networkData.network.configuration)
      setNetworkName(networkData.network.name)
    }
  }, [networkData])

  useEffect(() => {
    drawNetwork()
  }, [networkState, selectedNodes])

  const drawNetwork = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    networkState.connections.forEach((connection) => {
      const fromNode = networkState.nodes.find((n) => n.id === connection.from)
      const toNode = networkState.nodes.find((n) => n.id === connection.to)

      if (fromNode && toNode) {
        ctx.strokeStyle = connection.type === "quantum" ? "#3B82F6" : "#6B7280"
        ctx.lineWidth = connection.type === "quantum" ? 3 : 2
        ctx.setLineDash(connection.type === "quantum" ? [] : [5, 5])

        ctx.beginPath()
        ctx.moveTo(fromNode.position.x, fromNode.position.y)
        ctx.lineTo(toNode.position.x, toNode.position.y)
        ctx.stroke()
        ctx.setLineDash([])
      }
    })

    // Draw EPR pairs
    networkState.eprPairs.forEach((pair) => {
      const nodeA = networkState.nodes.find((n) => n.id === pair.nodeA)
      const nodeB = networkState.nodes.find((n) => n.id === pair.nodeB)

      if (nodeA && nodeB) {
        ctx.strokeStyle = "#EF4444"
        ctx.lineWidth = 4
        ctx.setLineDash([10, 5])

        ctx.beginPath()
        ctx.moveTo(nodeA.position.x, nodeA.position.y)
        ctx.lineTo(nodeB.position.x, nodeB.position.y)
        ctx.stroke()
        ctx.setLineDash([])
      }
    })

    // Draw nodes
    networkState.nodes.forEach((node) => {
      const isSelected = selectedNodes.includes(node.id)

      // Node circle
      ctx.fillStyle = node.type === "quantum" ? "#3B82F6" : "#6B7280"
      if (isSelected) {
        ctx.strokeStyle = "#EF4444"
        ctx.lineWidth = 3
      }

      ctx.beginPath()
      ctx.arc(node.position.x, node.position.y, 25, 0, 2 * Math.PI)
      ctx.fill()

      if (isSelected) {
        ctx.stroke()
      }

      // Node label
      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(node.label, node.position.x, node.position.y + 4)
    })
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on existing node
    const clickedNode = networkState.nodes.find((node) => {
      const distance = Math.sqrt(Math.pow(node.position.x - x, 2) + Math.pow(node.position.y - y, 2))
      return distance <= 25
    })

    if (clickedNode) {
      if (selectedTool === "connection" || selectedTool === "epr") {
        if (selectedNodes.includes(clickedNode.id)) {
          setSelectedNodes((prev) => prev.filter((id) => id !== clickedNode.id))
        } else if (selectedNodes.length < 2) {
          setSelectedNodes((prev) => [...prev, clickedNode.id])

          if (selectedNodes.length === 1) {
            // Create connection or EPR pair
            if (selectedTool === "connection") {
              const newConnection: NetworkConnection = {
                id: Date.now().toString(),
                from: selectedNodes[0],
                to: clickedNode.id,
                type: "quantum",
              }
              setNetworkState((prev) => ({
                ...prev,
                connections: [...prev.connections, newConnection],
              }))
            } else if (selectedTool === "epr") {
              const newEprPair = {
                nodeA: selectedNodes[0],
                nodeB: clickedNode.id,
              }
              setNetworkState((prev) => ({
                ...prev,
                eprPairs: [...prev.eprPairs, newEprPair],
              }))
            }
            setSelectedNodes([])
          }
        }
      }
    } else if (selectedTool === "node") {
      // Create new node
      const newNode: NetworkNode = {
        id: Date.now().toString(),
        position: { x, y },
        type: "quantum",
        label: `Q${networkState.nodes.length + 1}`,
      }
      setNetworkState((prev) => ({
        ...prev,
        nodes: [...prev.nodes, newNode],
      }))
    }
  }

  const simulateNetwork = () => {
    // Simplified network simulation
    console.log("Simulating quantum network...")
    // In a real implementation, this would simulate quantum protocols
  }

  const saveNetwork = async () => {
    try {
      if (networkId) {
        await updateNetwork({
          networkId,
          name: networkName,
          configuration: networkState,
        }).unwrap()
      } else {
        await createNetwork({
          name: networkName,
          configuration: networkState,
        }).unwrap()
      }
    } catch (error) {
      console.error("Failed to save network:", error)
    }
  }

  const clearNetwork = () => {
    setNetworkState({ nodes: [], connections: [], eprPairs: [] })
    setSelectedNodes([])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quantum Network Simulator</h1>
        <p className="text-gray-600">Design and simulate quantum communication networks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tools Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Network Tools</h3>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => setSelectedTool("node")}
                className={`w-full p-3 rounded-lg font-medium transition-colors ${
                  selectedTool === "node" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Add Node
              </button>
              <button
                onClick={() => setSelectedTool("connection")}
                className={`w-full p-3 rounded-lg font-medium transition-colors ${
                  selectedTool === "connection"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Add Connection
              </button>
              <button
                onClick={() => setSelectedTool("epr")}
                className={`w-full p-3 rounded-lg font-medium transition-colors ${
                  selectedTool === "epr" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Create EPR Pair
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Network Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Network Name</label>
                  <input
                    type="text"
                    value={networkName}
                    onChange={(e) => setNetworkName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
                  <span>Quantum Node</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-blue-600 mr-2"></div>
                  <span>Quantum Channel</span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-4 h-1 bg-red-600 mr-2"
                    style={{
                      background:
                        "repeating-linear-gradient(to right, #EF4444 0, #EF4444 4px, transparent 4px, transparent 8px)",
                    }}
                  ></div>
                  <span>EPR Pair</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Network Designer</h3>
              <div className="flex space-x-2">
                <button
                  onClick={simulateNetwork}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Simulate
                </button>
                <button
                  onClick={clearNetwork}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </button>
                <button
                  onClick={saveNetwork}
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
                height={500}
                onClick={handleCanvasClick}
                className="w-full cursor-crosshair"
              />
            </div>

            {selectedTool && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {selectedTool === "node" && "Click anywhere to add a quantum node"}
                  {selectedTool === "connection" && "Click two nodes to create a quantum connection"}
                  {selectedTool === "epr" && "Click two nodes to create an EPR pair"}
                </p>
              </div>
            )}

            {selectedNodes.length > 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Selected nodes: {selectedNodes.length}/2
                  {selectedNodes.length === 1 && " - Select another node to complete the connection"}
                </p>
              </div>
            )}
          </div>

          {/* Network Statistics */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Network Statistics</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{networkState.nodes.length}</div>
                <div className="text-sm text-gray-600">Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{networkState.connections.length}</div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{networkState.eprPairs.length}</div>
                <div className="text-sm text-gray-600">EPR Pairs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetworkSimulator
