import { format, formatDistanceToNowStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { Text, TextProps } from 'react-native'

function formatPublishedSince(date: string) {
  try {
    const publishedSince = formatDistanceToNowStrict(new Date(date), {
      locale: ptBR,
    })

    return `${publishedSince} atrás`
  } catch {
    return '...'
  }
}

function formatTooltipLabel(date: string, gmt = false) {
  const displayFormat = gmt
    ? "EEEE, d 'de' MMMM 'de' yyyy 'às' HH:mm z"
    : "EEEE, d 'de' MMMM 'de' yyyy 'às' HH:mm"

  try {
    return format(new Date(date), displayFormat, { locale: ptBR })
  } catch {
    return '...'
  }
}

interface PublishedSinceProps extends TextProps {
  date: string
}

export default function PublishedSince(props: PublishedSinceProps) {
  const [, setTooltipLabel] = useState(formatTooltipLabel(props.date, true))

  useEffect(() => {
    setTooltipLabel(formatTooltipLabel(props.date))
  }, [props.date])

  return <Text {...props}>{formatPublishedSince(props.date)}</Text>
}
