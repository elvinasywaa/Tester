import { useRegisterSW } from 'virtual:pwa-register/react'

function PWABadge() {
  // Cek update setiap 1 jam
  const period = 60 * 60 * 1000

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r)
      } else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target
          if (sw.state === 'activated')
            registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="fixed bottom-0 right-0 m-6 p-6 z-50" role="alert">
      {(offlineReady || needRefresh) && (
        <div className="bg-slate-800 text-white rounded-lg shadow-lg p-4 flex flex-col gap-2 border border-slate-700">
          <div className="mb-2">
            {offlineReady ? (
              <span>Aplikasi siap bekerja offline</span>
            ) : (
              <span>Konten baru tersedia, klik reload untuk update.</span>
            )}
          </div>
          <div className="flex gap-2">
            {needRefresh && (
              <button
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm font-bold"
                onClick={() => updateServiceWorker(true)}
              >
                Reload
              </button>
            )}
            <button
              className="px-3 py-1 border border-slate-500 hover:bg-slate-700 rounded text-sm"
              onClick={() => close()}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PWABadge

/**
 * Fungsi untuk mendaftarkan sinkronisasi periodik
 */
function registerPeriodicSync(period, swUrl, r) {
  if (period <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine)
      return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        'cache': 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200)
      await r.update()
  }, period)
}