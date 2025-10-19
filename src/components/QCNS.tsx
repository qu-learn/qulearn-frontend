import { useEffect, useMemo, useRef, useState } from 'react'
import { useCreateCircuitMutation, useUpdateCircuitMutation, useDeleteCircuitMutation, useGetCircuitQuery, useCreateNetworkMutation, useUpdateNetworkMutation, useDeleteNetworkMutation, useGetNetworkQuery } from '../utils/api'

interface QCNSProps {
  tab: 'circuit' | 'network' | 'sandbox'
  state: any
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}

interface CircuitSimulatorProps {
  circuitId?: string
  lessonTitle?: string
  onCircuitCreated?: (circuitId: string) => void
  onCircuitDeleted?: () => void
  isModal?: boolean
}

interface NetworkSimulatorProps {
  networkId?: string
  lessonTitle?: string
  onNetworkCreated?: (networkId: string) => void
  onNetworkDeleted?: () => void
  isModal?: boolean
}

function QCNS({ tab, state, iframeRef }: QCNSProps) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    console.log("Reloading iframe due to tab/state change")
    const id = crypto.randomUUID()
    iframeRef.current!.src = `/QCNS/ui/qcns-simulator.html?id=${id}`
  }, [tab, state])

  const handleMessage = useMemo(() => {
    return (event: MessageEvent) => {
      // Ensure the message is from the iframe
      if (event.source === iframeRef.current!.contentWindow) {
        console.log('Message from iframe:', event.data)
        if (event.data.type === 'qcns-initialized') {
          setInitialized(true)
          const window = iframeRef.current!.contentWindow as any
          window.qulearn.setState(tab + '-tab', state)
        } else {
          console.log('Unhandled message type:', event.data.type)
        }
      }
    }
  }, [iframeRef, tab, state])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handleMessage])

  return (
    <iframe
      ref={iframeRef}
      style={{
        width: "100%",
        height: "calc(100vh - 80px)",
        border: "none",
        display: initialized ? 'block' : 'none',
      }}
    />
  )
}

export function CircuitSimulator({
  circuitId,
  lessonTitle,
  onCircuitCreated,
  onCircuitDeleted,
  isModal = false
}: CircuitSimulatorProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const { data: circuitData } = useGetCircuitQuery(circuitId || "", { skip: !circuitId })
  const [createCircuit, { isLoading: isCreating }] = useCreateCircuitMutation()
  const [updateCircuit, { isLoading: isUpdating }] = useUpdateCircuitMutation()
  const [deleteCircuit] = useDeleteCircuitMutation()

  const handleSave = async () => {
    try {
      const window = iframeRef.current?.contentWindow as any
      const currentState = window?.qulearn?.getState()

      if (circuitId) {
        // Update existing circuit
        await updateCircuit({
          circuitId,
          name: `Circuit for ${lessonTitle || 'lesson'}`,
          configuration: currentState || circuitData?.circuit.configuration
        }).unwrap()
      } else {
        // Create new circuit
        const result = await createCircuit({
          name: `Circuit for ${lessonTitle || 'lesson'}`,
          configuration: currentState
        }).unwrap()

        if (onCircuitCreated) {
          onCircuitCreated(result.circuit.id)
        }
      }
    } catch (error) {
      console.error("Failed to save circuit:", error)
    }
  }

  const handleDelete = async () => {
    if (circuitId) {
      try {
        await deleteCircuit(circuitId).unwrap()
        if (onCircuitDeleted) {
          onCircuitDeleted()
        }
      } catch (error) {
        console.error("Failed to delete circuit:", error)
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      <QCNS
        tab='circuit'
        state={circuitData?.circuit.configuration}
        iframeRef={iframeRef}
      />
      {isModal && (
        <div className="flex justify-end space-x-2 px-4 py-3 border-t bg-white">
          {circuitId && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isCreating || isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isCreating || isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  )
}

export function NetworkSimulator({
  networkId,
  lessonTitle,
  onNetworkCreated,
  onNetworkDeleted,
  isModal = false
}: NetworkSimulatorProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const { data: networkData } = useGetNetworkQuery(networkId || "", { skip: !networkId })
  const [createNetwork, { isLoading: isCreating }] = useCreateNetworkMutation()
  const [updateNetwork, { isLoading: isUpdating }] = useUpdateNetworkMutation()
  const [deleteNetwork] = useDeleteNetworkMutation()

  const handleSave = async () => {
    try {
      const window = iframeRef.current?.contentWindow as any
      const currentState = window?.qulearn?.getState()

      if (networkId) {
        // Update existing network
        await updateNetwork({
          networkId,
          name: `Network for ${lessonTitle || 'lesson'}`,
          configuration: currentState || networkData?.network.configuration
        }).unwrap()
      } else {
        // Create new network
        const result = await createNetwork({
          name: `Network for ${lessonTitle || 'lesson'}`,
          configuration: currentState
        }).unwrap()

        if (onNetworkCreated) {
          onNetworkCreated(result.network.id)
        }
      }
    } catch (error) {
      console.error("Failed to save network:", error)
    }
  }

  const handleDelete = async () => {
    if (networkId) {
      try {
        await deleteNetwork(networkId).unwrap()
        if (onNetworkDeleted) {
          onNetworkDeleted()
        }
      } catch (error) {
        console.error("Failed to delete network:", error)
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      <QCNS
        tab='network'
        state={networkData?.network.configuration}
        iframeRef={iframeRef}
      />
      {isModal && (
        <div className="flex justify-end space-x-2 px-4 py-3 border-t bg-white">
          {networkId && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isCreating || isUpdating}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isCreating || isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  )
}

export function JSSandbox() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  return (
    <QCNS
      tab='sandbox'
      state={null}
      iframeRef={iframeRef}
    />
  )
}

export default QCNS
