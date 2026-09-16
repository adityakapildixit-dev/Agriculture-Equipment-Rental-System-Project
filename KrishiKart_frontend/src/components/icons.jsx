// Small hand-rolled icon set (no external icon library dependency).
// Each is a plain 20x20 stroke icon, currentColor-based.
import React from 'react'

const base = (children, props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"
       strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...props}>
    {children}
  </svg>
)

export const IconDashboard = (p) => base(<><rect x="2.5" y="2.5" width="6" height="6.5" rx="1"/><rect x="11.5" y="2.5" width="6" height="6.5" rx="1"/><rect x="2.5" y="11.5" width="6" height="6" rx="1"/><rect x="11.5" y="11.5" width="6" height="6" rx="1"/></>, p)
export const IconFarmer = (p) => base(<><circle cx="10" cy="6.5" r="3"/><path d="M3.5 17c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/></>, p)
export const IconOwner = (p) => base(<><path d="M3 8.5 10 3l7 5.5"/><path d="M5 8v8h10V8"/><path d="M8.3 16v-4h3.4v4"/></>, p)
export const IconMachine = (p) => base(<><rect x="2.5" y="9" width="9" height="5.5" rx="1"/><path d="M11.5 11h3.2l2.8 2.5v1h-6"/><circle cx="5.5" cy="16" r="1.6"/><circle cx="13.5" cy="16" r="1.6"/><path d="M5.5 9V5.5h4V9"/></>, p)
export const IconBooking = (p) => base(<><rect x="3" y="4" width="14" height="13" rx="1.5"/><path d="M3 8h14"/><path d="M6.5 2.5v3M13.5 2.5v3"/></>, p)
export const IconPayment = (p) => base(<><rect x="2.5" y="5" width="15" height="10" rx="1.5"/><path d="M2.5 8.5h15"/><path d="M5.5 12h3"/></>, p)
export const IconMaintenance = (p) => base(<><path d="M12 3.5a3.5 3.5 0 0 0-4.6 3.9L3 12.8V16h3.2l5.4-4.4a3.5 3.5 0 0 0 3.9-4.6l-2.4 2.4-1.9-.5-.5-1.9 2.4-2.4z"/></>, p)
export const IconInvoice = (p) => base(<><path d="M5 2.5h7l3 3V17H5z"/><path d="M12 2.5V6h3"/><path d="M7.2 10h5.6M7.2 12.6h5.6M7.2 15h3.5"/></>, p)
export const IconLogout = (p) => base(<><path d="M8 17H4.5A1.5 1.5 0 0 1 3 15.5v-11A1.5 1.5 0 0 1 4.5 3H8"/><path d="M13.5 13.5 17 10l-3.5-3.5"/><path d="M17 10H8"/></>, p)
export const IconPlus = (p) => base(<><path d="M10 4v12M4 10h12"/></>, p)
export const IconEdit = (p) => base(<><path d="M12.5 3.5 16 7l-9 9H3.5v-3.5z"/></>, p)
export const IconTrash = (p) => base(<><path d="M4 5.5h12"/><path d="M7.5 5.5V4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5"/><path d="M5.5 5.5 6.2 16a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9l.7-10.5"/></>, p)
export const IconClose = (p) => base(<><path d="M5 5l10 10M15 5 5 15"/></>, p)
export const IconMenu = (p) => base(<><path d="M3 5.5h14M3 10h14M3 14.5h14"/></>, p)
export const IconLeaf = (p) => base(<><path d="M4 16C4 8 9 3.5 16.5 3.5 16.5 11 12 16 4 16Z"/><path d="M4 16c3-4 6-6 12-8.5"/></>, p)
export const IconChevronDown = (p) => base(<path d="M5 7.5 10 12.5 15 7.5"/>, p)
export const IconCart = (p) => base(<><path d="M2.5 3.5h2l1.7 9.4a1.5 1.5 0 0 0 1.5 1.2h6.6a1.5 1.5 0 0 0 1.5-1.2l1.2-6.4H5.3"/><circle cx="8" cy="17" r="1.3"/><circle cx="14.5" cy="17" r="1.3"/></>, p)
