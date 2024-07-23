export function formatPhotoUrl(
  photoUrl?: string | null,
  updateAt?: string | null,
): string | null {
  const now = new Date().getTime().toString()

  if (!photoUrl) {
    return null
  }

  photoUrl = photoUrl + '?timestamp=' + updateAt || now
  return photoUrl
}

export function formatPhoneNumber(phone: string) {
  phone = phone.replaceAll(' ', '')

  if (!/^(?:\+244)?\d{9}$/.test(phone)) {
    throw new Error('Invalid number')
  }

  if (phone.startsWith('+244')) {
    return `+244 ${phone.slice(4, 7)} ${phone.slice(7, 10)} ${phone.slice(10)}`
  }

  return `+244 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`
}

export function formatMoney(
  amount: number,
  decimalCount = 2,
  decimal = ',',
  thousands = '.',
) {
  try {
    decimalCount = Math.abs(decimalCount)
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount

    const negativeSign = amount < 0 ? '-' : ''

    let [integerPart, decimalPart] = Math.abs(Number(amount) || 0)
      .toFixed(decimalCount)
      .split('.')

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands)

    return (
      negativeSign +
      integerPart +
      (decimalCount ? decimal + decimalPart.slice(0, decimalCount) : '') +
      ' AKZ'
    )
  } catch (e) {
    console.log(e)
  }
}
