import { useState } from 'react'

function SyncPanel({ syncId, syncStatus, connectSyncId, onClose }) {
  const [inputCode, setInputCode] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(syncId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — ignore
    }
  }

  const handleConnect = async () => {
    setConnectError('')
    setConnecting(true)
    const result = await connectSyncId(inputCode)
    setConnecting(false)
    if (result.success) {
      onClose()
    } else {
      setConnectError(result.error)
    }
  }

  const statusText = {
    syncing: '⏳ Saving…',
    synced: '✓ All changes saved',
    error: '⚠️ Sync error — changes saved locally',
    idle: '',
  }[syncStatus] ?? ''

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">🔄 Sync Across Devices</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {statusText && (
          <div className={`sync-status-banner sync-status-${syncStatus}`}>{statusText}</div>
        )}

        <div className="sync-section">
          <div className="sync-section-label">Your Sync Code</div>
          <div className="sync-code-box">
            <code className="sync-code">{syncId}</code>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p className="sync-hint">
            Share this code with your partner. On their device, paste it in the field below to sync the same checklist.
          </p>
        </div>

        <div className="sync-divider" />

        <div className="sync-section">
          <div className="sync-section-label">Connect to Another Device</div>
          <p className="sync-hint">
            Enter the sync code from another device. <strong>This will replace your current checklist</strong> with that device&apos;s data.
          </p>
          <div className="sync-input-row">
            <input
              className="form-input"
              placeholder="Paste sync code here…"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !connecting && inputCode.trim() && handleConnect()}
            />
            <button
              className="btn-primary"
              onClick={handleConnect}
              disabled={!inputCode.trim() || connecting}
            >
              {connecting ? 'Connecting…' : 'Connect'}
            </button>
          </div>
          {connectError && <p className="sync-error">{connectError}</p>}
        </div>
      </div>
    </div>
  )
}

export default SyncPanel
