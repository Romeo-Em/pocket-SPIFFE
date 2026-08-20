import { spawn } from "child_process"

function playSound(file) {
  spawn("afplay", [file], {
    detached: true,
    stdio: "ignore",
  }).unref()
}

export const SoundPlugin = async ({ client }) => {
  // Track pending ding timers per session so we can cancel them
  // if the session goes busy again before the timer fires
  const pendingTimers = new Map()
  // Track sessions we know are busy (to cancel false-idle dings)
  const busySessions = new Set()

  return {
    event: async ({ event }) => {
      // --- Permission request: play Funk to get attention ---
      // Handle both event names (SDK types say "permission.updated", docs say "permission.asked")
      if (event.type === "permission.asked" || event.type === "permission.updated") {
        playSound("/System/Library/Sounds/Funk.aiff")
        return
      }

      // --- Session goes busy: cancel any pending ding for this session ---
      if (event.type === "session.status") {
        const sessionID = event.properties.sessionID
        if (event.properties.status.type === "busy") {
          busySessions.add(sessionID)
          // Cancel any pending ding — session isn't actually done
          if (pendingTimers.has(sessionID)) {
            clearTimeout(pendingTimers.get(sessionID))
            pendingTimers.delete(sessionID)
          }
        } else if (event.properties.status.type === "idle") {
          busySessions.delete(sessionID)
        }
        return
      }

      // --- Session idle: determine if sub-agent or main task ---
      if (event.type === "session.idle") {
        const sessionID = event.properties.sessionID
        try {
          const session = await client.session.get({
            path: { id: sessionID },
          })

          if (session.data?.parentID) {
            // Sub-agent completed — play Pop immediately
            playSound("/System/Library/Sounds/Pop.aiff")
          } else {
            // Main session went idle — but is it truly done?
            // Cancel any existing pending timer for this session
            if (pendingTimers.has(sessionID)) {
              clearTimeout(pendingTimers.get(sessionID))
            }

            // Wait 1.5s and re-check: if still idle, play the ding
            const timer = setTimeout(async () => {
              pendingTimers.delete(sessionID)
              // If the session went busy in the meantime, skip the ding
              if (busySessions.has(sessionID)) {
                return
              }
              try {
                const statuses = await client.session.status()
                const sessionStatus = statuses.data?.[sessionID]
                if (!sessionStatus || sessionStatus.type === "idle") {
                  // Truly idle — task is done, waiting for user
                  playSound("/System/Library/Sounds/Glass.aiff")
                }
                // If busy/retry, skip — it's still working
              } catch {
                // If status check fails, play ding as fallback
                // (better to notify than to stay silent)
                playSound("/System/Library/Sounds/Glass.aiff")
              }
            }, 1500)

            pendingTimers.set(sessionID, timer)
          }
        } catch {
          // Session lookup failed — fallback to Pop
          playSound("/System/Library/Sounds/Pop.aiff")
        }
      }
    },
  }
}
