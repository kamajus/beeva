import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function MapPin(props: SvgProps) {
  return (
    <Svg fill="#8b6cef" viewBox="0 0 256 256" {...props}>
      <Path
        d="M128 24a80 80 0 00-80 80c0 72 80 128 80 128s80-56 80-128a80 80 0 00-80-80zm0 112a32 32 0 1132-32 32 32 0 01-32 32z"
        opacity={0.2}
      />
      <Path d="M128 64a40 40 0 1040 40 40 40 0 00-40-40zm0 64a24 24 0 1124-24 24 24 0 01-24 24zm0-112a88.1 88.1 0 00-88 88c0 31.4 14.51 64.68 42 96.25a254.19 254.19 0 0041.45 38.3 8 8 0 009.18 0 254.19 254.19 0 0041.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 00-88-88zm0 206c-16.53-13-72-60.75-72-118a72 72 0 01144 0c0 57.23-55.47 105-72 118z" />
    </Svg>
  );
}
