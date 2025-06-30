import type { SVGProps } from "react"

export const VercelLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-label="Vercel Logo" fill="currentColor" viewBox="0 0 75 65" {...props}>
    <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
  </svg>
)

export const NextJsLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-label="Next.js Logo" viewBox="0 0 180 180" role="img" {...props}>
    <mask id="a" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="currentColor"></circle>
    </mask>
    <g mask="url(#a)">
      <circle cx="90" cy="90" r="90" fill="currentColor"></circle>
      <path d="M149.508 157.52L69.142 54H54v72h12.11v-59.4l74.398 90.92h11.118v-72h-12.11v59.4Z" fill="#000"></path>
    </g>
  </svg>
)

export const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
