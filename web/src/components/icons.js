import React from 'react'

const Undo = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.53564 3L5.00011 6.53553L8.53564 10.0711" />
  <path d="M11 21.5C15.1421 21.5 18.5 18.1421 18.5 14C18.5 9.85786 15.1421 6.5 11 6.5" />
  <path d="M11 6.5H5" />
</svg>

const Redo = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14.9644 3L18.4999 6.53553L14.9644 10.0711" />
  <path d="M12.5 21.5C8.35787 21.5 5 18.1421 5 14C5 9.85786 8.35786 6.5 12.5 6.5" />
  <path d="M12.5 6.5H18.5" />
</svg>

const Hint = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12Z" strokeLinecap="round" />
  <path d="M21 12C12 6 12 6 3 12C12 18 12 18 21 12L21 12Z" />
</svg>

const HintBox = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.4999 12.0003C13.5 11.1718 12.8285 10.5001 12.0001 10.5C11.1716 10.4999 10.4999 11.1717 10.5 12.0002C10.5001 12.8287 11.1716 13.5002 12 13.5002C12.8284 13.5002 13.4998 12.8286 13.4999 12.0003Z" strokeLinecap="round" />
  <path d="M20.5 4V3.5H20H4H3.5V4V20V20.5H4H20H20.5V20V4Z" />
  <path d="M6.00007 12L6 12C12 16 12 16 18 11.9999C12 8.00003 12 8.00004 6.00007 12Z" />
</svg>

const CheckBox = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 3.5H3.5V4V20V20.5H4H20H20.5V20V4V3.5H20H4Z" />
  <path d="M17 9L10 16L7 13" />
</svg>

const Box = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 3.5H3.5V4V20V20.5H4H20H20.5V20V4V3.5H20H4Z" />
</svg>

const Check = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 13.5L9 17L19 7" />
</svg>

const X = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />
</svg>

const Cogs = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" />
  <path d="M12 4C11.6613 4 11.3276 4.02104 11 4.06189L10 6.34141C9.65069 6.46488 9.31622 6.61977 9 6.80269L7 5.75463C6.54067 6.12284 6.12284 6.54067 5.75463 7L6.80269 9C6.61977 9.31622 6.46488 9.65069 6.34141 10L4.06189 11C4.02104 11.3276 4 11.6613 4 12" />
  <path d="M20 12C20 11.6613 19.979 11.3276 19.9381 11L17.6586 10C17.5351 9.65069 17.3802 9.31622 17.1973 9L18.2454 7C17.8772 6.54067 17.4593 6.12284 17 5.75463L15 6.80269C14.6838 6.61977 14.3493 6.46488 14 6.34141L13 4.06189C12.6724 4.02104 12.3387 4 12 4" />
  <path d="M4 12C4 12.3387 4.02104 12.6724 4.06189 13L6.34141 14C6.46488 14.3493 6.61977 14.6838 6.80269 15L5.75463 17C6.12284 17.4593 6.54067 17.8772 7 18.2454L9 17.1973C9.31622 17.3802 9.65069 17.5351 10 17.6586L11 19.9381C11.3276 19.979 11.6613 20 12 20" />
  <path d="M12 20C12.3387 20 12.6724 19.979 13 19.9381L14 17.6586C14.3493 17.5351 14.6838 17.3802 15 17.1973L17 18.2454C17.4593 17.8772 17.8772 17.4593 18.2454 17L17.1973 15C17.3802 14.6838 17.5351 14.3493 17.6586 14L19.9381 13C19.979 12.6724 20 12.3387 20 12" />
</svg>

const Upload = () => <svg width="24" height="24" viewBox="0 0 24 24" style={{ stroke: 'currentColor' }} fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.5 9.5L12 6.00003L15.5 9.5" />
  <path d="M12 15L12 6" />
  <path d="M17.5 15V18.5H6.5V15" />
</svg>

const ArrowRight = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ stroke: 'currentColor' }} xmlns="http://www.w3.org/2000/svg">
  <path d="M9.07129 19.1421L16.1424 12.071L9.07129 4.99995" />
</svg>

const ArrowLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ stroke: 'currentColor' }} xmlns="http://www.w3.org/2000/svg">
  <path d="M15.0713 5L8.00022 12.0711L15.0713 19.1421" />
</svg>

const GitHub = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ stroke: 'currentColor' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
</svg>

export {
  Undo,
  Redo,
  Hint,
  HintBox,
  CheckBox,
  Cogs,
  Upload,
  Check,
  X,
  Box,
  GitHub,
  ArrowLeft,
  ArrowRight
}