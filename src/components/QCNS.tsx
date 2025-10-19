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

interface SimulatorWrapperProps {
  tab: 'circuit' | 'network' | 'sandbox'
  itemId?: string
  lessonTitle?: string
  data?: any
  isModal: boolean
  createMutation: any
  updateMutation: any
  deleteMutation: any
  onItemCreated: ((id: string) => void) | undefined
  onItemDeleted: (() => void) | undefined
  saveButtonColor: string
}

function SimulatorWrapper({
  tab,
  itemId,
  lessonTitle,
  data,
  isModal,
  createMutation,
  updateMutation,
  deleteMutation,
  onItemCreated,
  onItemDeleted,
  saveButtonColor
}: SimulatorWrapperProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const handleSave = async () => {
    try {
      const window = iframeRef.current?.contentWindow as any
      const currentState = window?.qulearn?.getState()

      if (itemId) {
        const [update] = updateMutation
        await update({
          [`${tab}Id`]: itemId,
          name: `${tab.charAt(0).toUpperCase() + tab.slice(1)} for ${lessonTitle || 'lesson'}`,
          configuration: currentState || data
        }).unwrap()
      } else {
        const [create] = createMutation
        const result = await create({
          name: `${tab.charAt(0).toUpperCase() + tab.slice(1)} for ${lessonTitle || 'lesson'}`,
          configuration: currentState
        }).unwrap()

        if (onItemCreated) {
          onItemCreated(result[tab].id)
        }
      }
    } catch (error) {
      console.error(`Failed to save ${tab}:`, error)
    }
  }

  const handleDelete = async () => {
    if (itemId) {
      try {
        const [deleteItem] = deleteMutation
        await deleteItem(itemId).unwrap()
        if (onItemDeleted) {
          onItemDeleted()
        }
      } catch (error) {
        console.error(`Failed to delete ${tab}:`, error)
      }
    }
  }

  const isSaving = createMutation[1].isLoading || updateMutation[1].isLoading

  return (
    <div className="h-full flex flex-col">
      <QCNS
        tab={tab}
        state={data}
        iframeRef={iframeRef}
      />
      {isModal && (
        <div className="flex justify-end space-x-2 px-4 py-3 border-t bg-white">
          {itemId && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 bg-${saveButtonColor}-600 text-white rounded-lg hover:bg-${saveButtonColor}-700 transition-colors disabled:opacity-50`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  )
}

export function CircuitSimulator({
  circuitId,
  lessonTitle,
  onCircuitCreated,
  onCircuitDeleted,
  isModal = false
}: CircuitSimulatorProps) {
  const { data: circuitData } = useGetCircuitQuery(circuitId || "", { skip: !circuitId })
  const createMutation = useCreateCircuitMutation()
  const updateMutation = useUpdateCircuitMutation()
  const deleteMutation = useDeleteCircuitMutation()

  return (
    <SimulatorWrapper
      tab='circuit'
      itemId={circuitId}
      lessonTitle={lessonTitle}
      data={circuitData?.circuit.configuration}
      isModal={isModal}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      onItemCreated={onCircuitCreated}
      onItemDeleted={onCircuitDeleted}
      saveButtonColor='blue'
    />
  )
}

export function NetworkSimulator({
  networkId,
  lessonTitle,
  onNetworkCreated,
  onNetworkDeleted,
  isModal = false
}: NetworkSimulatorProps) {
  const { data: networkData } = useGetNetworkQuery(networkId || "", { skip: !networkId })
  const createMutation = useCreateNetworkMutation()
  const updateMutation = useUpdateNetworkMutation()
  const deleteMutation = useDeleteNetworkMutation()

  return (
    <SimulatorWrapper
      tab='network'
      itemId={networkId}
      lessonTitle={lessonTitle}
      data={networkData?.network.configuration}
      isModal={isModal}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      onItemCreated={onNetworkCreated}
      onItemDeleted={onNetworkDeleted}
      saveButtonColor='purple'
    />
  )
}

export function JSSandbox() {
  const dummyMutation = [() => Promise.resolve(), { isLoading: false }]
  
  return (
    <SimulatorWrapper
      tab='sandbox'
      itemId={undefined}
      lessonTitle={undefined}
      data={null}
      isModal={false}
      createMutation={dummyMutation}
      updateMutation={dummyMutation}
      deleteMutation={dummyMutation}
      onItemCreated={undefined}
      onItemDeleted={undefined}
      saveButtonColor='blue'
    />
  )
}

export default QCNS
