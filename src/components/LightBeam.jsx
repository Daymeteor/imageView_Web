import { useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

const BEAM_CONFIGS = [
  { width: 70,  skew: -12, top: '3%',  left: '-5%', opacity: 0.10, blur: 70,  delay: 0 },
  { width: 110, skew: -14, top: '12%', left: '-3%', opacity: 0.07, blur: 100, delay: 2.5 },
  { width: 50,  skew: -10, top: '0%',  left: '8%',  opacity: 0.13, blur: 45,  delay: 4 },
  { width: 180, skew: -17, top: '22%', left: '-10%',opacity: 0.04, blur: 130, delay: 1.2 },
  { width: 35,  skew: -7,  top: '8%',  left: '18%', opacity: 0.16, blur: 28,  delay: 3.5 },
];

export default function LightBeam() {
  const containerRef = useRef(null);
  const beamRefs = useRef([]);
  const spotRefs = useRef([]);

  useGSAP(() => {
    // 鼠标平滑跟踪（quickTo 比 rAF 轮询性能更好）
    const skewTo = beamRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'skewX', { duration: 0.6, ease: 'power2.out' }) : null
    );
    const xTo = beamRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power2.out' }) : null
    );
    const yTo = beamRefs.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' }) : null
    );

    const onMouse = (e) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 ~ 1
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      beamRefs.current.forEach((_, i) => {
        if (skewTo[i]) skewTo[i](BEAM_CONFIGS[i].skew + mx * 4);
        if (xTo[i]) xTo[i](mx * 20);
        if (yTo[i]) yTo[i](my * 12);
      });
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => window.removeEventListener('mousemove', onMouse);
  }, { scope: containerRef });

  // 滚动视差（scrub）
  useGSAP(() => {
    beamRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        yPercent: 12 + i * 3,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    });
    spotRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        yPercent: 20 + i * 5,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    });
  }, { scope: containerRef });

  const setBeamRef = (i) => (el) => { beamRefs.current[i] = el; };
  const setSpotRef = (i) => (el) => { spotRefs.current[i] = el; };

  return (
    <div ref={containerRef} style={{
      position: 'fixed', inset: 0, zIndex: 2,
      pointerEvents: 'none', overflow: 'hidden',
    }}>
      {BEAM_CONFIGS.map((beam, i) => (
        <div
          key={`beam-${i}`}
          ref={setBeamRef(i)}
          style={{
            position: 'absolute',
            top: beam.top,
            left: beam.left,
            width: `${beam.width}px`,
            height: '130vh',
            background: `linear-gradient(
              180deg,
              rgba(220, 200, 154, ${beam.opacity * 1.3}) 0%,
              rgba(191, 155, 94, ${beam.opacity}) 25%,
              rgba(191, 155, 94, ${beam.opacity * 0.5}) 55%,
              rgba(120, 158, 102, ${beam.opacity * 0.2}) 80%,
              transparent 100%
            )`,
            transform: `skewX(${beam.skew}deg)`,
            filter: `blur(${beam.blur}px)`,
            animation: `beamFlow ${9 + beam.delay}s ease-in-out infinite`,
            animationDelay: `${beam.delay}s`,
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {BEAM_CONFIGS.slice(0, 4).map((beam, i) => (
        <div
          key={`spot-${i}`}
          ref={setSpotRef(i)}
          style={{
            position: 'absolute',
            top: `calc(${beam.top} + ${25 + i * 18}%)`,
            left: `calc(${beam.left} + ${35 + i * 12}%)`,
            width: `${beam.width * 1.6}px`,
            height: `${beam.width * 1.6}px`,
            background: `radial-gradient(
              ellipse at center,
              rgba(220, 200, 154, 0.055) 0%,
              rgba(191, 155, 94, 0.025) 35%,
              transparent 70%
            )`,
            filter: 'blur(35px)',
            animation: `beamBreath ${7 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${i * 1.8}s`,
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  );
}
