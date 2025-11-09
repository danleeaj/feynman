"use client"

import { useState } from "react"
import Image from "next/image"

export function OtterInteractive() {
  const [sprite, setSprite] = useState("/sprites/otter-mouthclose.png")

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 h-48">
      <div className="container flex items-center justify-end h-full pr-10">
        <div className="relative w-48 h-48 rotate-10">
          <Image
            src={sprite}
            alt="Interactive Otter"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
