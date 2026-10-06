import type { SVGProps } from 'react'

type VkIconProps = SVGProps<SVGSVGElement> & { size?: number | string }

export function VkIcon({ size = 24, ...props }: VkIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.8 4l4.5 16 4.5-16h-2.4l-2.1 11.2-2.1-11.2z" />
      <path d="M11.8 4h1.6v16h-1.6z" />
      <path d="M13.4 12l5.2-8h1.6l-5.2 8z" />
      <path d="M13.4 12h1.6l5.2 8h-1.6z" />
    </svg>
  )
}
