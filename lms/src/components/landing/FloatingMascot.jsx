import { useState } from "react"

const mascotImages = {
  idle: "/mascots/mascot-idle.png",
  wave: "/mascots/mascot-wave.png",
  jump: "/mascots/mascot-jump.png",
}

export default function FloatingMascot() {
  const [pose, setPose] = useState("idle")
  const [isHovered, setIsHovered] = useState(false)
  const [showJumpText, setShowJumpText] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    setPose("wave")
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setPose("idle")
  }

  const handleClick = () => {
    setShowJumpText(true)
    setPose("jump")

    setTimeout(() => {
      setShowJumpText(false)
      setPose("idle")
    }, 800)
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Speech bubble */}
      {isHovered && !showJumpText && (
        <div className="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-[#8f1721] shadow-lg">
          Halo! 👋
        </div>
      )}

      {showJumpText && (
        <div className="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-[#8f1721] shadow-lg">
          Yeayyy!!
        </div>
      )}

      {/* Mascot */}
      <img
        src={mascotImages[pose]}
        alt="Koperasi Desa mascot"
        className={`
          w-32
          select-none
          object-contain
          drop-shadow-xl
          cursor-pointer
          transition-transform
          duration-300

          ${pose === "idle" ? "animate-mascot-float" : ""}

          ${pose === "jump" ? "animate-mascot-jump" : ""}

          ${pose === "wave" ? "scale-105" : ""}
        `}
        draggable="false"
      />
    </div>
  )
}