export type AuthNotification = {
  id: string
  email: string
  name: string
  phone?: string
  action: 'login' | 'register'
  timestamp: string
  emailSubject: string
  emailBody: string
}

const NOTIFICATION_EVENT = 'boka_auth_notification'

export async function sendAuthNotification(
  email: string,
  name: string,
  action: 'login' | 'register',
  phone?: string,
): Promise<void> {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const actionText = action === 'login' ? 'logged in' : 'registered an account'
  
  const emailSubject = `✨ Welcome to BokaMarket, ${name}! ✨`
  const emailBody = `
Dear ${name},

You have successfully ${actionText} at BokaMarket! 🧶✨

Our artisanal studio is thrilled to have you. Whether you're here to browse our slow-fashion hand-crocheted treasures, book a beautiful photography session, or design your own customized commission in our interactive sandbox, we are dedicated to crafting slow, sunlit joy for your everyday life.

Account Details:
- Name: ${name}
- Email: ${email}
${phone ? `- Phone: ${phone}` : ''}
- Role: ${email.toLowerCase() === 'bokasyarnmarket@gmail.com' ? 'Admin / Owner' : 'Artisanal Customer'}

If you did not perform this action, please contact our support team immediately at support@bokasyarnmarket@gmail.com.

Warmest regards,
Bokamoso Sebake & the Boka Studio Team 🧶✨
  `.trim()

  const notification: AuthNotification = {
    id: crypto.randomUUID(),
    email,
    name,
    phone,
    action,
    timestamp,
    emailSubject,
    emailBody,
  }

  // 1. Textbelt SMS integration (Real SMS delivery, 1 free text per day)
  if (phone && phone.trim().length > 5) {
    try {
      console.log(`[NotificationService] Attempting real SMS delivery via Textbelt to ${phone}...`)
      const res = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          message: `BokaMarket: Hi ${name}! You have successfully ${actionText} at our studio. Enjoy your artisanal journey! 🧶✨`,
          key: 'textbelt',
        }),
      })
      const data = await res.json()
      if (data.success) {
        console.log('[NotificationService] SMS successfully dispatched to network!')
      } else {
        console.warn('[NotificationService] SMS quota limit reached or invalid phone number:', data.error)
      }
    } catch (e) {
      console.warn('[NotificationService] Textbelt API connection error:', e)
    }
  }

  // 2. Dispatch simulated SMTP trigger / web hooks
  try {
    console.log(`[NotificationService] Sending SMTP Email notification to ${email}...`)
    // We send a mock request to a free logger to verify network transmission
    await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: emailSubject,
        body: emailBody,
      }),
    })
  } catch (e) {
    console.warn('[NotificationService] Mailer webhook failed:', e)
  }

  // 3. Emit a custom event so the UI can pop up a gorgeous boho-chic preview dialog
  const event = new CustomEvent(NOTIFICATION_EVENT, { detail: notification })
  window.dispatchEvent(event)
}

export function subscribeToNotifications(callback: (notif: AuthNotification) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<AuthNotification>
    callback(customEvent.detail)
  }
  window.addEventListener(NOTIFICATION_EVENT, handler)
  return () => window.removeEventListener(NOTIFICATION_EVENT, handler)
}
