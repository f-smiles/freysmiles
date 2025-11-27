'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './style.css'

export default function Locations() {
  const mapContainerRef = useRef()
  const mapRef = useRef()
  const innerCursor = useRef(null)
  const outerCursor = useRef(null)
  const horizontalRef = useRef(null)
  const verticalRef = useRef(null)
  const hoverRAF = useRef(null)
  const hoverMoveCursor = useRef(null)
  const hoverUnveilCursor = useRef(null)
  const [outerCursorSpeed, setOuterCursorSpeed] = useState(0)
  const [showCircleCursor, setShowCircleCursor] = useState(false)
  const [showCrosshairCursor, setShowCrosshairCursor] = useState(false)

  const initHover = () => {
    let clientX = -100
    let clientY = -100
    const rect = verticalRef.current.getBoundingClientRect()

    gsap.set(horizontalRef.current, { opacity: 1 })
    gsap.set(verticalRef.current, { opacity: 1 })

    if (hoverRAF.current) cancelAnimationFrame(hoverRAF.current)

    function unveilCursor() {
      gsap.set(horizontalRef.current, {
        x: clientX,
        y: clientY,
      })
      gsap.set(verticalRef.current, {
        x: clientX - rect.width / 2,
        y: clientY - rect.height / 2,
      })
      setShowCrosshairCursor(true)
    }
    function moveCursor(e) {
      clientX = e.clientX
      clientY = e.clientY
    }
    hoverUnveilCursor.current = unveilCursor
    hoverMoveCursor.current = moveCursor
    document.addEventListener('mousemove', unveilCursor)
    document.addEventListener('mousemove', moveCursor)

    function render() {
      gsap.set(horizontalRef.current, {
        x: clientX,
        y: clientY,
      })
      gsap.to(verticalRef.current, {
        x: clientX - rect.width / 2,
        y: clientY - rect.height / 2,
      })
      hoverRAF.current = requestAnimationFrame(render)
    }
    hoverRAF.current = requestAnimationFrame(render)
  }

  const handleMarkerEnter = () => {
    hoverRAF.current = null
    hoverMoveCursor.current = null
    hoverUnveilCursor.current = null
    initHover()
  }
  const handleMarkerLeave = () => {
    setShowCrosshairCursor(false)
    document.removeEventListener('mousemove', hoverUnveilCursor.current)
    document.removeEventListener('mousemove', hoverMoveCursor.current)
    cancelAnimationFrame(hoverRAF.current)
    gsap.set(horizontalRef.current, { opacity: 0 })
    gsap.set(verticalRef.current, { opacity: 0 })
  }

  useEffect(() => {
    if (!innerCursor.current || !outerCursor.current || !horizontalRef.current || !verticalRef.current) return

    gsap.set(horizontalRef.current, { y: -100 })

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_MAP_STYLE,
      center: [-75.5, 40.5],
      zoom: 8,
    })

    const lehightonElement = document.createElement('div')
    const lehightonInner = document.createElement('div')
    lehightonInner.className = 'marker marker-pop'
    new mapboxgl.Marker({
      element: lehightonElement,
    }).setLngLat([-75.73039, 40.817605]).addTo(mapRef.current)
    lehightonElement.appendChild(lehightonInner)
    
    const schnecksvilleElement = document.createElement('div')
    const schnecksvilleInner = document.createElement('div')
    schnecksvilleInner.className = 'marker marker-pop'
    new mapboxgl.Marker({
      element: schnecksvilleElement,
    }).setLngLat([-75.59864, 40.661055]).addTo(mapRef.current)
    schnecksvilleElement.appendChild(schnecksvilleInner)

    const allentownElement = document.createElement('div')
    const allentownInner = document.createElement('div')
    allentownInner.className = 'marker marker-pop'
    new mapboxgl.Marker({
      element: allentownElement,
    }).setLngLat([-75.51711, 40.565945]).addTo(mapRef.current)
    allentownElement.appendChild(allentownInner)
    
    const bethlehemElement = document.createElement('div')
    const bethlehemInner = document.createElement('div')
    bethlehemInner.className = 'marker marker-pop'
    new mapboxgl.Marker({
      element: bethlehemElement,
    }).setLngLat([-75.295623, 40.66286]).addTo(mapRef.current)
    bethlehemElement.appendChild(bethlehemInner)

    const initCursor = () => {
      let clientX = -100
      let clientY = -100
      const rect = outerCursor.current.getBoundingClientRect()
      
      function unveilCursor() {
        gsap.set(innerCursor.current, {
          x: clientX,
          y: clientY,
        })
        gsap.set(outerCursor.current, {
          x: clientX - rect.width / 2,
          y: clientY - rect.height / 2,
        })
        setTimeout(() => {
          setOuterCursorSpeed(0.2)
        }, 100)
        setShowCircleCursor(true)
      }
      document.addEventListener('mousemove', unveilCursor)
      document.addEventListener('mousemove', (e) => {
        clientX = e.clientX
        clientY = e.clientY
      })

      function render() {
        gsap.set(innerCursor.current, {
          x: clientX,
          y: clientY,
        })
        gsap.to(outerCursor.current, {
          x: clientX - rect.width / 2,
          y: clientY - rect.height / 2,
          duration: 0.2,
        })
        if (showCircleCursor) {
          document.removeEventListener('mousemove', unveilCursor)
        }
        requestAnimationFrame(render)
      }
      requestAnimationFrame(render)
    }

    [lehightonElement, schnecksvilleElement, bethlehemElement, allentownElement].forEach((marker) => {
      marker.addEventListener('mouseenter', handleMarkerEnter)
      marker.addEventListener('mouseleave', handleMarkerLeave)
    })

    initCursor()
  }, [])

  return (
    <section className='h-[100dvh]'>
      <div
        ref={mapContainerRef}
        className='map-container h-[100dvh]'
      />

      {/* Circle Cursor */}
      <div ref={innerCursor} className='circle-cursor circle-cursor--inner' />
      <div ref={outerCursor} className='circle-cursor circle-cursor--outer' />

      {/* Crosshair Cursor */}
      <div ref={horizontalRef} className='cursor__line cursor__line--horizontal' />
      <div ref={verticalRef} className='cursor__line cursor__line--vertical' />
    </section>
  )
}