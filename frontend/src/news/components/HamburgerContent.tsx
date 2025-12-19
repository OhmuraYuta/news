'use client';

export default function HamburgerContent({isOpen, toggle}: {isOpen: boolean, toggle: () => void}) {
  return (
      <div className="relative h-full w-screen flex">
        <ul className="relative h-full w-[60vw] bg-white z-[60] transition-all duration-300"
          style={{transform: isOpen ? 'translateX(0%)':'translateX(-100%)' }}
        >
          <li>ほげ</li>
        </ul>
        <div className={`bg-black/20 absolute bottom-0 w-full h-full transition-all duration-300
          ${isOpen ? 'opacity-100 z-50':'opacity-0 -z-5'}`}
          onClick={toggle}
        >
        </div>
      </div>
  )
}