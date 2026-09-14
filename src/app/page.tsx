'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useResume } from '@/hooks/useResume'
import { RoomChrome } from '@/components/rooms/RoomChrome'
import { HeroRoom } from '@/components/rooms/HeroRoom'
import { AboutRoom } from '@/components/rooms/AboutRoom'
import { ExperienceRoom } from '@/components/rooms/ExperienceRoom'
import { EducationRoom } from '@/components/rooms/EducationRoom'
import { SkillsRoom } from '@/components/rooms/SkillsRoom'
import { ProjectsRoom } from '@/components/rooms/ProjectsRoom'
import { ContactRoom } from '@/components/rooms/ContactRoom'
import { HudTop } from '@/components/hud/HudTop'
import { HudBottom } from '@/components/hud/HudBottom'
import { NavArrows } from '@/components/hud/NavArrows'
import { CustomCursor } from '@/components/hud/CustomCursor'
import { BootOverlay } from '@/components/hud/BootOverlay'
import { HeroMesh } from '@/components/3d/HeroMesh'

const TOTAL_ROOMS = 7
const ROOM_TAGS = ['home', 'about', 'experience', 'education', 'skills', 'projects', 'contact']

export default function Home() {
  const { resume, loading } = useResume()
  const [activeIdx, setActiveIdx] = useState(0)
  const [booted, setBooted] = useState(false)
  const wheelLock = useRef(false)
  const touchStart = useRef(0)

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_ROOMS - 1, idx))
    setActiveIdx(clamped)
  }, [])

  const prev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo])
  const next = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo])

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!booted) return
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goTo(activeIdx - 1)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goTo(activeIdx + 1)
      } else if (e.key === 'Escape') {
        goTo(0)
      } else {
        const num = parseInt(e.key)
        if (num >= 1 && num <= TOTAL_ROOMS) {
          goTo(num - 1)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIdx, booted, goTo])

  // Wheel navigation
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (!booted || wheelLock.current) return

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(delta) < 30) return

      // If the wheel happened over a scrollable inner container (e.g. the
      // projects grid or the experience rail) that still has room to move
      // in this direction, let the browser scroll it natively instead of
      // hijacking the gesture for room navigation.
      let node = e.target as HTMLElement | null
      while (node) {
        const style = getComputedStyle(node)
        const scrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll')
          && node.scrollHeight > node.clientHeight
        if (scrollable) {
          const atTop = node.scrollTop <= 0
          const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1
          if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) return
        }
        node = node.parentElement
      }

      e.preventDefault()
      wheelLock.current = true
      if (delta > 0) goTo(activeIdx + 1)
      else goTo(activeIdx - 1)

      setTimeout(() => { wheelLock.current = false }, 700)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [activeIdx, booted, goTo])

  // Touch swipe
  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      touchStart.current = e.touches[0].clientX
    }
    function onTouchEnd(e: TouchEvent) {
      if (!booted) return
      const diff = touchStart.current - e.changedTouches[0].clientX
      if (Math.abs(diff) > 60) {
        if (diff > 0) goTo(activeIdx + 1)
        else goTo(activeIdx - 1)
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [activeIdx, booted, goTo])

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  if (loading) {
    return (
      <div className="boot-overlay">
        <div className="boot-text">
          <div className="boot-text__line" style={{ opacity: 1 }}>Loading data...</div>
        </div>
      </div>
    )
  }

  if (!resume) return null

  return (
    <div className="scanlines film-grain">
      {/* Boot screen */}
      {!booted && <BootOverlay onComplete={handleBootComplete} />}

      {/* Custom cursor */}
      <CustomCursor />

      {/* HUD */}
      {booted && (
        <>
          <HudTop activeIdx={activeIdx} />
          <HudBottom activeIdx={activeIdx} onNavigate={goTo} />
          <NavArrows activeIdx={activeIdx} total={TOTAL_ROOMS} onPrev={prev} onNext={next} />
        </>
      )}

      {/* World */}
      <main className="world-viewport">
        <div
          className="world"
          style={{ transform: `translate3d(-${activeIdx * 100}vw, 0, 0)` }}
        >
          {/* Room 1: Hero */}
          <RoomChrome tag={ROOM_TAGS[0]} number={1}>
            <HeroMesh />
            <HeroRoom personal={resume.personal} />
          </RoomChrome>

          {/* Room 2: About */}
          <RoomChrome tag={ROOM_TAGS[1]} number={2}>
            <AboutRoom personal={resume.personal} />
          </RoomChrome>

          {/* Room 3: Experience */}
          <RoomChrome tag={ROOM_TAGS[2]} number={3}>
            <ExperienceRoom experience={resume.experience} />
          </RoomChrome>

          {/* Room 4: Education */}
          <RoomChrome tag={ROOM_TAGS[3]} number={4}>
            <EducationRoom education={resume.education} />
          </RoomChrome>

          {/* Room 5: Skills */}
          <RoomChrome tag={ROOM_TAGS[4]} number={5}>
            <SkillsRoom skills={resume.skills} />
          </RoomChrome>

          {/* Room 6: Projects */}
          <RoomChrome tag={ROOM_TAGS[5]} number={6}>
            <ProjectsRoom projects={resume.projects} />
          </RoomChrome>

          {/* Room 7: Contact */}
          <RoomChrome tag={ROOM_TAGS[6]} number={7}>
            <ContactRoom personal={resume.personal} />
          </RoomChrome>
        </div>
      </main>
    </div>
  )
}
