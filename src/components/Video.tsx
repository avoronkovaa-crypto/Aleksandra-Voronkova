import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { video, videoStill } from '../lib/assets'
import s from './Video.module.css'

type Props = {
  /** File name in public/videos (see VIDEO in src/lib/assets.ts). */
  name: string
  className?: string
}

/**
 * Muted, looping background video. It only plays while on screen, fades in
 * once the first frame is ready, and becomes a still for reduced motion.
 */
export function Video({ name, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {})
      else el.pause()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  return (
    <span className={`${s.wrap} ${className ?? ''}`}>
      {reduce ? (
        <img src={videoStill(name)} alt="" className={s.media} draggable={false} />
      ) : (
        <video
          ref={ref}
          className={s.media}
          muted
          loop
          playsInline
          preload="auto"
          data-ready={ready}
          onPlaying={() => setReady(true)}
        >
          <source src={video(name, 'webm')} type="video/webm" />
          <source src={video(name, 'mp4')} type="video/mp4" />
        </video>
      )}
    </span>
  )
}
