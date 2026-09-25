import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { video, videoStill } from '../lib/assets'
import { Img } from './Img'
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

type PlayableProps = {
  name: string
  /** Figma image hash shown before the video starts. */
  poster: string
  /** Button styles from the page, so the Play pill matches the design. */
  playClass: string
  buttonClass: string
}

/**
 * Click-to-play video block: poster + Play button → the video fades in and
 * plays; clicking it pauses; at the end it fades back to the poster.
 */
export function PlayableVideo({ name, poster, playClass, buttonClass }: PlayableProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle')
  const [progress, setProgress] = useState(0)

  const play = () => {
    const el = ref.current
    if (!el) return
    if (state === 'idle') el.currentTime = 0
    el.play().then(() => setState('playing')).catch(() => {})
  }
  const pause = () => {
    ref.current?.pause()
    setState('paused')
  }

  // Stop when scrolled away, so it never plays unseen.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !el.paused) {
        el.pause()
        setState('paused')
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Img src={poster} tone="dark" />
      <video
        ref={ref}
        className={s.playable}
        data-visible={state !== 'idle'}
        muted
        playsInline
        preload="metadata"
        onClick={pause}
        onTimeUpdate={e => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
        onEnded={() => {
          setState('idle')
          setProgress(0)
        }}
      >
        <source src={video(name, 'webm')} type="video/webm" />
        <source src={video(name, 'mp4')} type="video/mp4" />
      </video>
      <div className={playClass} data-hidden={state === 'playing'}>
        <button type="button" className={buttonClass} onClick={play} tabIndex={state === 'playing' ? -1 : 0}>
          {state === 'paused' ? 'Resume' : 'Play'}
        </button>
      </div>
      <span className={s.progress} data-visible={state !== 'idle'} style={{ transform: `scaleX(${progress})` }} />
    </>
  )
}
