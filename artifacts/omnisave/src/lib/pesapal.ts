const CONSUMER_KEY = 'vTibxQeLvkiJ0aBZQk3Ci5gL2BUx1dP0'
const CONSUMER_SECRET = 'kdwghPqFeT5dxwnhrpVccfY9B7o='
const BASE = '/api/pesapal'

export interface PesapalOrder {
  orderTrackingId: string
  merchantReference: string
  redirectUrl: string
}

export interface PesapalStatus {
  statusCode: number
  description: string
  paymentMethod: string
  confirmationCode: string
  paymentAccount: string
  amount: number
}

export async function pesapalGetToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET }),
    })
    const data = await res.json()
    return data.token || null
  } catch {
    return null
  }
}

export async function pesapalRegisterIPN(token: string, ipnUrl: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/api/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url: ipnUrl, ipn_notification_type: 'GET' }),
    })
    const data = await res.json()
    return data.ipn_id || null
  } catch {
    return null
  }
}

export async function pesapalSubmitOrder(
  token: string,
  ipnId: string,
  params: {
    amount: number
    description: string
    email: string
    phone: string
    firstName: string
    callbackUrl: string
    cancellationUrl: string
  }
): Promise<PesapalOrder | null> {
  try {
    const merchantReference = `VJPILES-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    const res = await fetch(`${BASE}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id: merchantReference,
        currency: 'UGX',
        amount: params.amount,
        description: params.description,
        callback_url: params.callbackUrl,
        cancellation_url: params.cancellationUrl,
        redirect_mode: 'PARENT_WINDOW',
        notification_id: ipnId,
        billing_address: {
          email_address: params.email || '',
          phone_number: params.phone || '',
          country_code: 'UG',
          first_name: params.firstName || 'Customer',
          last_name: '',
        },
      }),
    })
    const data = await res.json()
    if (data.order_tracking_id && data.redirect_url) {
      return {
        orderTrackingId: data.order_tracking_id,
        merchantReference: data.merchant_reference || merchantReference,
        redirectUrl: data.redirect_url,
      }
    }
    return null
  } catch {
    return null
  }
}

export async function pesapalGetStatus(token: string, orderTrackingId: string): Promise<PesapalStatus | null> {
  try {
    const res = await fetch(
      `${BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    )
    const data = await res.json()
    let statusCode = -1
    if (typeof data.status_code === 'number') statusCode = data.status_code
    else if (typeof data.status_code === 'string') statusCode = parseInt(data.status_code, 10) || -1
    const desc = (data.payment_status_description || '').toLowerCase()
    if (statusCode === -1) {
      if (desc === 'completed') statusCode = 1
      else if (desc === 'failed') statusCode = 2
      else if (desc === 'reversed') statusCode = 3
    }
    return {
      statusCode,
      description: data.payment_status_description || '',
      paymentMethod: data.payment_method || '',
      confirmationCode: data.confirmation_code || '',
      paymentAccount: data.payment_account || '',
      amount: data.amount || 0,
    }
  } catch {
    return null
  }
}
