'use client'

import { Tldraw, useEditor, getSnapshot } from 'tldraw'
import { useSync } from '@tldraw/sync'
import 'tldraw/tldraw.css'
import { useCallback, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

function SaveButton({ boardId, editor }) {
  const saveSnapshot = useCallback(async () => {
    if (!editor) return

    try {
      const snapshot = getSnapshot(editor.store)
      
      await fetch('/api/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId,
          data: snapshot
        })
      })

      toast.success('Saved to database!')
    } catch (error) {
      toast.error('Failed to save')
    }
  }, [editor, boardId])

  const exportAs = useCallback(async (format) => {
    if (!editor) return

    try {
      if (format === 'json') {
        const snapshot = getSnapshot(editor.store)
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `board-${boardId}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Exported as JSON')
      } else {
        const shapeIds = Array.from(editor.getCurrentPageShapeIds())
        await editor.exportAs(shapeIds, format, `board-${boardId}`)
        toast.success(`Exported as ${format.toUpperCase()}`)
      }
    } catch (error) {
      toast.error('Export failed')
    }
  }, [editor, boardId])

  return (
    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 flex flex-col gap-2">
      <button
        onClick={saveSnapshot}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm"
      >
        💾 Save
      </button>
      
      <div className="relative group">
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm">
          📥 Export
        </button>
        <div className="hidden group-hover:block absolute right-full mr-2 top-0 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
          <button
            onClick={() => exportAs('json')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
          >
            JSON
          </button>
          <button
            onClick={() => exportAs('svg')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
          >
            SVG
          </button>
          <button
            onClick={() => exportAs('png')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
          >
            PNG
          </button>
        </div>
      </div>
    </div>
  )
}

function SaveButtonWrapper({ boardId }) {
  const editor = useEditor()
  return <SaveButton boardId={boardId} editor={editor} />
}

export default function WhiteboardCanvas({ boardId }) {
  const [syncError, setSyncError] = useState(false)
  const syncServerUrl = process.env.NEXT_PUBLIC_SYNC_SERVER_URL || 'ws://localhost:5858'
  const uri = `${syncServerUrl}?roomId=${boardId}`
  
  let store
  try {
    store = useSync({ 
      uri, 
      roomId: boardId,
      onError: () => setSyncError(true)
    })
  } catch (error) {
    console.error('Sync connection failed:', error)
    setSyncError(true)
  }

  if (syncError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-4">Unable to connect to sync server</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0">
      <Tldraw store={store}>
        <SaveButtonWrapper boardId={boardId} />
      </Tldraw>
    </div>
  )
}
