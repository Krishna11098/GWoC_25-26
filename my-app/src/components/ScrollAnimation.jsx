"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const pathRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const path = pathRef.current;
    const container = containerRef.current;

    if (!path || !container) return () => {};

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom bottom",
        scrub: 1,
        markers: false,
        onUpdate: (self) => {
          const drawLength = pathLength * (1 - self.progress);
          path.style.strokeDashoffset = drawLength;
        },
      },
    });

    const handleResize = () => {
      const newPathLength = path.getTotalLength();
      path.style.strokeDasharray = newPathLength;
      path.style.strokeDashoffset = newPathLength;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf(path);
    };
  }, []);

  return (
    <section className="spotlight">
      <div className="row four-cards">
        <div className="four-cards-heading">
          <h2>Choose your play-style</h2>
        </div>
        <div className="card-grid">
          <div className="card-item">
            <div className="card">
              <h3>Play at Home</h3>
            </div>
          </div>
          <div className="card-item">
            <div className="card">
              <h3>Play Together (Live)</h3>
            </div>
          </div>
          <div className="card-item">
            <div className="card">
              <h3>Play for Occasions</h3>
            </div>
          </div>
          <div className="card-item">
            <div className="card">
              <h3>Play and Earn Points</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="card">
            <h2>What's happening now</h2>
            <p>Currently happening and comming next event updates .</p>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h3>Dynamic content</h3>
            <div className="img">
              <Image
                src="/img2.jpg"
                alt="Illustration 2"
                width={800}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="img">
            <Image
              src="/img3.jpg"
              alt="Illustration 3"
              width={800}
              height={600}
            />
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h2>Built for increasing information demands</h2>
            <p>
              Whether it is files, notes, or incoming messages, the app sorts
              and prioritizes items automatically. It prevents clutter and helps
              maintain clarity during busy periods.
            </p>
          </div>
        </div>
      </div>

      <div className="svg-path" ref={containerRef}>
        <svg
          viewBox="0 0 330 809"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <path
            ref={pathRef}
            d="M294.852 35.0003C294.852 35.0003 45.8518 42.0003 45.8518 184C45.8519 336.633 325.137 355.544 275.852 500C246.852 585 -38.1482 756 52.8518 524C143.852 292 265.852 774 265.852 774"
            stroke="#E46B1B"
            strokeWidth="70"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "stroke-dashoffset 0.1s ease-out",
              willChange: "stroke-dashoffset",
            }}
          />
        </svg>
      </div>
    </section>
  );
}
