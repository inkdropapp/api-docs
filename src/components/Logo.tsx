'use client'

import { useId } from 'react'

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  const id = useId()
  const ringTop = `${id}-ring-top`
  const ringBottom = `${id}-ring-bottom`
  const drop = `${id}-drop`
  const clipRingBottom = `${id}-clip-ring-bottom`
  const gradRingTop = `${id}-grad-ring-top`
  const gradRingBottom = `${id}-grad-ring-bottom`
  const gradShade = `${id}-grad-shade`
  const gradDrop = `${id}-grad-drop`
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="123.95 140.45 553.8 626.26"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <path
          id={ringTop}
          d="m220.89 550.5s-6.07-11.15-8.8-24.46c-2.74-13.3 4.7-27.2 17.22-48.33s126.59-215.41 132.65-226.96c6.07-11.54 20.53-25.04 38.34-25.04s29.16 11.35 42.46 35.02 132.46 224.41 136.76 232.04 13.89 19.37 5.48 52.43c10.57 16.24 63.98-65.35 63.98-65.35l-25.7-67.04-8.22-13.43-119.47-203.86s-32.23-54.65-95.29-54.65-90.19 43.83-105.84 71.74-122.87 209.35-122.87 209.35l-2.61 5.35s-7.37 27.91-7.17 41.02 9.59 55.57 9.59 55.57l43.63 35.41z"
        />
        <path
          id={ringBottom}
          d="m615.07 399.39s13.83 31.89 9.91 60.94-15.65 42.1-30.78 65.32-64.7 107.22-64.7 107.22-12.39 24-25.43 34.57-28.7 12.39-40.96 12.39-114.78 0-114.78 0-19.43.98-24.33 0c-4.89-.98-17.61-3.91-27.78-13.3s-18.98-23.09-25.43-34.63c-6.46-11.54-51.46-88.07-54.78-92.07s-28.96-23.76-37.17-48.02c-8.22-24.26-15.07-45.39-7.24-69.85-10.76 17.8-32.28 51.65-39.33 68.87-7.04 17.22-14.67 63.59 3.13 94.89 10.37 18.23 43.37 76.61 69.12 122.19 20.52 36.32 59.01 58.78 100.73 58.78h141.82 44.77c40.89 0 78.74-21.58 99.57-56.77l69.71-117.79c21.87-36.95 21.48-82.98-1.02-119.56z"
        />
        <path
          id={drop}
          d="m432.31 618.67 60.98-105.63c14.23-24.64-3.56-55.44-32.01-55.44h-121.96c-28.45 0-46.24 30.8-32.01 55.44l60.98 105.63c14.23 24.64 49.79 24.64 64.02 0l60.98-105.63c14.23-24.64-3.56-55.44-32.01-55.44h-121.96c-28.45 0-46.24 30.8-32.01 55.44l60.98 105.63c14.23 24.64 49.79 24.64 64.02 0z"
        />
        <clipPath id={clipRingBottom}>
          <use href={`#${ringBottom}`} />
        </clipPath>
        <linearGradient
          id={gradRingTop}
          gradientUnits="userSpaceOnUse"
          x1="210.7189"
          x2="590.8203"
          y1="350.0869"
          y2="350.0869"
        >
          <stop offset="0" stopColor="#bda2f2" />
          <stop offset=".4925" stopColor="#86a4fa" />
          <stop offset=".731" stopColor="#8f8df6" />
          <stop offset=".9447" stopColor="#967cf3" />
        </linearGradient>
        <linearGradient
          id={gradRingBottom}
          gradientUnits="userSpaceOnUse"
          x1="147.3275"
          x2="666.8901"
          y1="583.0435"
          y2="583.0435"
        >
          <stop offset="0" stopColor="#c9b5ee" />
          <stop offset="1" stopColor="#6a50f3" />
        </linearGradient>
        <linearGradient
          id={gradShade}
          gradientUnits="userSpaceOnUse"
          x1="163.6442"
          x2="234.6008"
          y1="443.1305"
          y2="550.3479"
        >
          <stop offset="0" stopColor="#b194f2" />
          <stop offset="1" stopColor="#7c68e3" />
        </linearGradient>
        <linearGradient
          id={gradDrop}
          gradientUnits="userSpaceOnUse"
          x1="308.3956"
          x2="463.7435"
          y1="486.0213"
          y2="563.8908"
        >
          <stop offset="0" stopColor="#c090f2" />
          <stop offset=".1818" stopColor="#aa81ef" />
          <stop offset=".5355" stopColor="#8569eb" />
          <stop offset=".8208" stopColor="#6d5ae8" />
          <stop offset="1" stopColor="#6554e7" />
        </linearGradient>
      </defs>
      <use fill={`url(#${gradRingTop})`} href={`#${ringTop}`} />
      <use fill={`url(#${gradRingBottom})`} href={`#${ringBottom}`} />
      <path
        clipPath={`url(#${clipRingBottom})`}
        fill={`url(#${gradShade})`}
        d="m164.02 428.09c-3.11 7.5-8.07 22.41-6.13 41.22.35 3.35 1.96 16.98 10.17 32.28 5.96 11.1 13.56 18.68 28.76 33.85 10.76 10.74 13.3 12.1 22.7 21.52 11.77 11.81 20.4 22.33 25.83 29.35l1.57-46.37-53.02-92.74-15.07-33.46z"
      />
      <use fill={`url(#${gradDrop})`} href={`#${drop}`} />
    </svg>
  )
}
