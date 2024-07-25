import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export default function NoWishe() {
  return (
    <Svg width={90} height={90} fill="#212121" viewBox="0 0 256 256">
      <Path fill="none" d="M0 0H256V256H0z" />
      <Path
        opacity={0.2}
        d="M184 174.54L213.67 192 205.6 159.41 232 137.61 197.35 134.94 184 104 170.65 134.94 136 137.61 162.4 159.41 154.33 192 184 174.54z"
      />
      <Path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M40 64L216 64"
      />
      <Path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M40 128L96 128"
      />
      <Path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M40 192L112 192"
      />
      <Path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M184 174.54L213.67 192 205.6 159.41 232 137.61 197.35 134.94 184 104 170.65 134.94 136 137.61 162.4 159.41 154.33 192 184 174.54z"
      />
    </Svg>
  )
}
