"use client";

import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { CSSProperties } from "react";
import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { EventKey, weddingData as d } from "./config";

const ease = [0.22, 1, 0.36, 1] as const;
const weddingDate = new Date(d.wedding.date);

function formatDate(value: string, compact = false) {
  return new Intl.DateTimeFormat("en-IN", compact
    ? { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }
    : { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(value));
}

function Monogram({ light = false }: { light?: boolean }) {
  return <span className={`premiumMonogram ${light ? "light" : ""}`} aria-label={`${d.bride.firstName} and ${d.groom.firstName}`}>
    {d.bride.firstName[0]}<i />{d.groom.firstName[0]}
  </span>;
}

function SectionHeading({ eyebrow, title, text, align = "center" }: { eyebrow: string; title: string; text?: string; align?: "center" | "left" }) {
  const item = { hidden: { opacity: 0, y: 24, scale: .985 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: .9, ease } } };
  return <motion.header className={`sectionHeading ${align}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: .14 } } }}>
    <motion.p className="eyebrow" variants={item}>{eyebrow}</motion.p>
    <motion.h2 variants={item}>{title}</motion.h2>
    {text && <motion.p className="sectionLead" variants={item}>{text}</motion.p>}
  </motion.header>;
}

function CinematicImage({ src, alt, sizes, position = "center", priority = false }: { src: string; alt: string; sizes: string; position?: string; priority?: boolean }) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3.5%", "3.5%"]);
  const scale = useTransform(scrollYProgress, [0, .5, 1], [1.075, 1.025, 1.075]);
  const smoothY = useSpring(y, { stiffness: 75, damping: 24, mass: .45 });
  const smoothScale = useSpring(scale, { stiffness: 65, damping: 25, mass: .5 });
  return <motion.div ref={target} className="cinematicImage" style={{ y: smoothY, scale: smoothScale }}>
    <Image src={src} alt={alt} fill priority={priority} sizes={sizes} style={{ objectFit: "cover", objectPosition: position }} />
  </motion.div>;
}

const petalSettings = [
  [4, 0, 15, -24, 9], [11, -7, 18, 28, 7], [19, -12, 16, -18, 10], [27, -3, 20, 35, 8],
  [35, -15, 17, -30, 6], [43, -9, 21, 24, 9], [52, -1, 16, -22, 7], [60, -13, 19, 32, 10],
  [68, -5, 22, -28, 7], [76, -17, 18, 20, 8], [84, -8, 20, -34, 10], [92, -2, 17, 26, 6],
] as const;

function Petals() {
  return <div className="petalField" aria-hidden="true">{petalSettings.map(([left, delay, duration, drift, size], index) => <i key={index} style={{ "--left": `${left}%`, "--delay": `${delay}s`, "--duration": `${duration}s`, "--drift": `${drift}px`, "--size": `${size}px` } as CSSProperties} />)}</div>;
}

function Intro({ onEnter, onMusic }: { onEnter: () => void; onMusic: () => Promise<boolean> }) {
  const [phase, setPhase] = useState<"loading" | "cinematic" | "envelope">("loading");
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratching = useRef(false);
  const strokes = useRef(0);
  const revealScheduled = useRef(false);
  const transitionTimer = useRef<number | null>(null);
  const introImages = [d.images.hero, d.images.gallery[2], d.images.story];

  useEffect(() => {
    const cinematic = window.setTimeout(() => setPhase("cinematic"), 1300);
    const envelope = window.setTimeout(() => setPhase("envelope"), 4400);
    return () => {
      window.clearTimeout(cinematic);
      window.clearTimeout(envelope);
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    };
  }, []);

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealScheduled.current) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#f4e5bc");
    gradient.addColorStop(.45, "#b78b2b");
    gradient.addColorStop(.72, "#dfc277");
    gradient.addColorStop(1, "#f5e8c5");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(62,43,17,.10)";
    for (let index = 0; index < 520; index += 1) ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1, 1);
    ctx.strokeStyle = "rgba(76,52,19,.45)";
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, rect.width - 36, rect.height - 36);
    ctx.textAlign = "center";
    ctx.fillStyle = "#493314";
    ctx.font = `600 ${Math.max(22, rect.width * .055)}px Georgia, serif`;
    ctx.fillText(`${d.bride.firstName[0]}  &  ${d.groom.firstName[0]}`, rect.width / 2, rect.height * .44);
    ctx.font = `600 ${Math.max(10, rect.width * .021)}px Arial, sans-serif`;
    ctx.fillText("SCRATCH HERE", rect.width / 2, rect.height * .61);
    ctx.globalCompositeOperation = "destination-out";
    canvas.dataset.ready = "true";
  }, []);

  // AnimatePresence mounts this canvas after the previous panel finishes exiting.
  const mountScratchCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    canvasRef.current = canvas;
    paintCover();
    const observer = new ResizeObserver(paintCover);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      canvasRef.current = null;
    };
  }, [paintCover]);

  const revealInvitation = useCallback(() => {
    if (revealScheduled.current) return;
    revealScheduled.current = true;
    setRevealed(true);
    canvasRef.current?.classList.add("cleared");
    transitionTimer.current = window.setTimeout(() => {
      void onMusic();
      onEnter();
    }, 2000);
  }, [onEnter, onMusic]);

  const scratch = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!scratching.current || revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.arc(event.clientX - rect.left, event.clientY - rect.top, Math.max(26, rect.width * .06), 0, Math.PI * 2);
    ctx.fill();
    strokes.current += 1;
    if (strokes.current > 28) revealInvitation();
  };

  return <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: .7, ease }}>
    <div className="introMedia" aria-hidden="true">
      {introImages.map((image, index) => <motion.div className="introImage" key={image.src} initial={{ opacity: index === 0 ? 1 : 0, scale: 1.08 }} animate={{ opacity: [0, 1, 1, 0], scale: [1.08, 1.04, 1.01, 1] }} transition={{ duration: 7.5, repeat: Infinity, delay: index * 2.5, ease: "easeInOut" }}><Image src={image.src} alt="" fill priority={index === 0} sizes="100vw" style={{ objectFit: "cover", objectPosition: "position" in image ? image.position : "center" }} /></motion.div>)}
      <div className="introShade" /><div className="introGlow" />
    </div>
    <AnimatePresence mode="wait">
      {phase === "loading" && <motion.div className="introCopy" key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Monogram light /><p className="eyebrow">WEDIFY PRESENTS</p><h1>{d.bride.firstName} &amp; {d.groom.firstName}</h1><div className="loadingLine"><i /></div>
      </motion.div>}
      {phase === "cinematic" && <motion.div className="introCopy" key="cinematic" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
        <span className="sparkle">✦</span><p className="eyebrow">A CELEBRATION OF LOVE</p><h2>{d.bride.firstName} &amp; {d.groom.firstName}</h2><p>Together with our family, we invite you to celebrate our journey into forever.</p>
      </motion.div>}
      {phase === "envelope" && <motion.div className="invitationShell" key="envelope" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}>
        <div className="invitationCard">
          <Monogram /><p className="eyebrow">WEDDING INVITATION</p><h3>{d.bride.firstName} &amp; {d.groom.firstName}</h3><p className="formalNames">{d.groom.fullName} <i /> {d.bride.fullName}</p>
          <div className="scratchReveal">
            <div className="celebrationReveal"><small>OUR CELEBRATIONS</small><strong>{d.bride.firstName} &amp; {d.groom.firstName}</strong><div className="revealDates"><div><span>ENGAGEMENT</span><b>{formatDate(d.engagement.date, true)}</b><em>{d.engagement.time}</em></div><i /><div><span>WEDDING</span><b>{formatDate(d.wedding.date, true)}</b><em>{d.wedding.time}</em></div></div></div>
            <canvas ref={mountScratchCanvas} role="button" tabIndex={0} aria-label="Scratch the gold layer to open the invitation" onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); void onMusic(); revealInvitation(); } }} onPointerDown={(event) => { scratching.current = true; event.currentTarget.setPointerCapture(event.pointerId); void onMusic(); scratch(event); }} onPointerMove={scratch} onPointerUp={() => { scratching.current = false; }} onPointerCancel={() => { scratching.current = false; }} />
          </div>
          {revealed && <p className="revealStatus active">OPENING OUR INVITATION…</p>}
        </div>
      </motion.div>}
    </AnimatePresence>
  </motion.div>;
}

function Navigation() {
  const links = [["home", "Home"], ["couple", "Couple"], ["story", "Story"], ["events", "Events"], ["gallery", "Gallery"], ["rsvp", "RSVP"]];
  const [open, setOpen] = useState(false);
  return <header className="topNav"><nav className="glassPanel"><a className="navBrand" href="#home">{d.bride.firstName} &amp; {d.groom.firstName}</a><div className="desktopLinks">{links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</div><button className="menuButton" onClick={() => setOpen(value => !value)} aria-label="Toggle menu" aria-expanded={open}>{open ? "×" : "☰"}</button></nav>{open && <div className="mobileLinks glassPanel">{links.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</div>}</header>;
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => { const total = document.documentElement.scrollHeight - window.innerHeight; setProgress(total > 0 ? window.scrollY / total * 100 : 0); };
    update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update);
  }, []);
  return <div className="scrollProgress" style={{ width: `${progress}%` }} />;
}

function Hero() {
  return <section id="home" className="premiumHero"><CinematicImage src={d.images.hero.src} alt={`${d.bride.firstName} and ${d.groom.firstName}`} priority sizes="100vw" position={d.images.hero.position} /><div className="heroOverlay" /><Petals /><motion.div className="heroContent" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
    <p className="eyebrow">SAVE THE DATE · {formatDate(d.wedding.date, true)}</p><h1>{d.bride.firstName}<span>&amp;</span>{d.groom.firstName}</h1><p>Together with our family, we joyfully invite you to celebrate our wedding.</p><a href="#events" className="heroButton">VIEW CELEBRATIONS</a>
  </motion.div><a className="scrollHint" href="#countdown">SCROLL<i /></a></section>;
}

function useCountdown(date: string) {
  const calculate = useCallback(() => { const distance = Math.max(0, new Date(date).getTime() - Date.now()); return { days: Math.floor(distance / 86400000), hours: Math.floor(distance / 3600000) % 24, minutes: Math.floor(distance / 60000) % 60, seconds: Math.floor(distance / 1000) % 60 }; }, [date]);
  const [time, setTime] = useState(calculate);
  useEffect(() => { const timer = window.setInterval(() => setTime(calculate()), 1000); return () => window.clearInterval(timer); }, [calculate]);
  return time;
}

function CountdownSection() {
  const time = useCountdown(d.wedding.date);
  return <section id="countdown" className="patternSection sectionSpace"><div className="sectionShell"><SectionHeading eyebrow="COUNTING MOMENTS" title="The Celebration Begins Soon" /><div className="countdownGrid">{Object.entries(time).map(([label, value], index) => <motion.div className="glassPanel countdownCard" key={label} initial={{ opacity: 0, y: 24, scale: .96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, delay: index * .07, ease }}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></motion.div>)}</div></div></section>;
}

function ProfileCard({ person, role, image }: { person: typeof d.bride; role: string; image: string }) {
  const profileImage =
    role === "THE GROOM"
      ? "/images/DSC09267.jpg"
      : role === "THE BRIDE"
        ? "/images/DSC09663.jpg"
        : image;
  return <motion.article className={`profileCard ${role === "THE GROOM" ? "groomProfile" : "brideProfile"}`} initial={{ opacity: 0, x: role === "THE GROOM" ? -45 : 45, y: 22, scale: .96 }} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1, ease }}>
    <div className="profilePhoto"><CinematicImage src={profileImage} alt={person.fullName} sizes="(max-width: 640px) 100vw, (max-width: 900px) 45vw, 35vw" /></div>
    <div className="profileCopy">
      <p className="eyebrow">{role}</p>
      <h3>{person.fullName}</h3>
      <p className="profileBio">{person.bio}</p>
      <dl className="profileFamily">
        <div><dt>{role === "THE GROOM" ? "Son" : "Daughter"} of</dt><dd>{person.father}<span className="familyAmpersand">&amp;</span>{person.mother}</dd></div>
        <div><dt>Siblings</dt><dd>{person.siblings.map(name => <span className="siblingName" key={name}>{name}</span>)}</dd></div>
      </dl>
      {person.instagram && <a className="profileSocial" href={`https://instagram.com/${person.instagram}`} target="_blank" rel="noreferrer"><span>@{person.instagram}</span><span aria-hidden="true">↗</span></a>}
    </div>
  </motion.article>;
}

function CoupleSection() {
  return <section id="couple" className="sectionSpace"><div className="sectionShell"><SectionHeading eyebrow="THE COUPLE" title={`${d.groom.firstName} and ${d.bride.firstName}`} text="Two hearts, two journeys, and one beautiful promise of forever." /><div className="coupleGrid"><ProfileCard person={d.groom} role="THE GROOM" image={d.images.gallery[4].src} /><motion.div className="coupleFeature" initial={{ opacity: 0, y: 24, scale: .97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .9, ease }}><motion.span className="coupleFeatureMonogram" aria-hidden="true" initial={{ opacity: 0, rotate: -12 }} whileInView={{ opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: .25, duration: .8, ease }}>{d.bride.firstName[0]}<i />{d.groom.firstName[0]}</motion.span><motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .35, duration: .7 }}>FOREVER BEGINS</motion.p><motion.h3 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .48, duration: .8, ease }}>{d.couple.hashtag}</motion.h3><motion.div className="coupleFeatureFlourish" aria-hidden="true" initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ delay: .65, duration: .9, ease }}><i />✦<i /></motion.div><motion.p className="coupleFeatureNames" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .8, duration: .8 }}>{d.bride.firstName} <span>&amp;</span> {d.groom.firstName}</motion.p></motion.div><ProfileCard person={d.bride} role="THE BRIDE" image={d.images.story.src} /></div></div></section>;
}

function StorySection() {
  const reveal = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: .85, ease } } };
  return <section id="story" className="surfaceSection sectionSpace"><div className="sectionShell">
    <SectionHeading eyebrow="LOVE STORY" title="Our Cinematic Chapter" />
    <motion.article className="storyCard" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: .18 } } }}>
      <div className="storyText">
        <motion.p className="eyebrow" variants={reveal}>A BEAUTIFUL BEGINNING</motion.p>
        <motion.h3 variants={reveal}>{d.story.title}</motion.h3>
        <motion.div className="storyRule" aria-hidden="true" variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1, transition: { duration: 1, ease } } }} />
        <motion.p className="storyProse" variants={reveal}>{d.story.text}</motion.p>
        <motion.span className="storyOrnament" aria-hidden="true" variants={reveal}>✦</motion.span>
      </div>
    </motion.article>
  </div></section>;
}

function RingsTransition() {
  return <motion.section className="ringsTransition" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: .13 } } }}><motion.p className="eyebrow" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>TWO HEARTS · ONE PROMISE</motion.p><motion.div className="ringsArtwork" variants={{ hidden: { opacity: 0, scale: .82, rotate: -6 }, visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, ease } } }}><span className="ringsGlow" /><Image src="/images/wedding-rings-engraved-clean.png" alt="Two interlocking gold wedding rings engraved with Jeremy and Anuja" width={1375} height={1144} sizes="(max-width: 640px) 78vw, 360px" /></motion.div><motion.h2 variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: .8, ease } } }}>Forever Begins Here</motion.h2><motion.i className="ringsRule" aria-hidden="true" variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: .8, ease } } }} /></motion.section>;
}

function googleCalendar(type: EventKey) {
  const event = d[type]; const first = type === "engagement" ? d.engagement.ceremony : d.wedding.church;
  const start = new Date(event.date); const end = new Date(start.getTime() + (type === "engagement" ? 4 : 6) * 3600000);
  const compact = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({ action: "TEMPLATE", text: `${d.bride.firstName} & ${d.groom.firstName} — ${type === "engagement" ? "Engagement" : "Wedding"}`, dates: `${compact(start)}/${compact(end)}`, details: d.shareText.replace("{url}", window.location.href), location: `${first.name}; reception at ${event.reception.name}` });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function EventCard({ type, image }: { type: EventKey; image: string }) {
  const event = d[type]; const first = type === "engagement" ? d.engagement.ceremony : d.wedding.church; const title = type === "engagement" ? "Engagement" : "Wedding";
  return <motion.article className="eventCard" initial={{ opacity: 0, y: 55, rotateX: 4, scale: .96 }} whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1, ease }}><CinematicImage src={image} alt={`${title} celebration`} sizes="(max-width: 760px) 100vw, 50vw" /><div className="eventOverlay" /><div className="eventCopy"><p className="eyebrow">{formatDate(event.date, true)} · {event.time}</p><h3>{title}</h3><p className="eventVenue"><b>{first.name}</b><span>{first.address}</span></p><p className="receptionNote">Reception · {event.reception.time} at {event.reception.name}</p><div className="eventActions"><details className="calendarMenu"><summary>ADD TO CALENDAR</summary><div><a href={googleCalendar(type)} target="_blank" rel="noreferrer">ANDROID</a><a href={`/api/calendar?event=${type}`} download={`${type}.ics`}>APPLE</a></div></details></div></div></motion.article>;
}

function VenueMap({ label, venue }: { label: string; venue: { name: string; address: string; mapsUrl: string; embedUrl: string } }) {
  return <article className="venueMap"><div className="venueMapFrame"><iframe src={venue.embedUrl} title={`${label} — ${venue.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div><div className="venueMapCopy"><span>{label}</span><b>{venue.name}</b><a href={venue.mapsUrl} target="_blank" rel="noreferrer">OPEN MAP ↗</a></div></article>;
}

function EventsSection() {
  return <section id="events" className="patternSection sectionSpace"><div className="sectionShell"><SectionHeading eyebrow="WEDDING EVENTS" title="Ceremony and Celebration" text={`${d.bibleVerse.text} — ${d.bibleVerse.reference}`} /><div className="eventsGrid"><div className="eventGroup"><EventCard type="engagement" image={d.images.gallery[1].src} /><section className="eventMapGroup"><p className="eyebrow">ENGAGEMENT LOCATIONS</p><div className="venueMaps"><VenueMap label="FUNCTION" venue={d.engagement.ceremony} /><VenueMap label="RECEPTION" venue={d.engagement.reception} /></div></section></div><div className="eventGroup"><EventCard type="wedding" image={d.images.hero.src} /><section className="eventMapGroup"><p className="eyebrow">WEDDING LOCATIONS</p><div className="venueMaps"><VenueMap label="FUNCTION" venue={d.wedding.church} /><VenueMap label="RECEPTION" venue={d.wedding.reception} /></div></section></div></div></div></section>;
}

function GallerySection() {
  const [index, setIndex] = useState<number | null>(null); const [zoom, setZoom] = useState(false); const [auto, setAuto] = useState(false); const touch = useRef(0);
  const change = useCallback((direction: number) => setIndex(value => value === null ? 0 : (value + direction + d.images.gallery.length) % d.images.gallery.length), []);
  useEffect(() => { if (index === null) return; const key = (event: KeyboardEvent) => { if (event.key === "Escape") setIndex(null); if (event.key === "ArrowRight") change(1); if (event.key === "ArrowLeft") change(-1); }; window.addEventListener("keydown", key); document.body.style.overflow = "hidden"; return () => { window.removeEventListener("keydown", key); document.body.style.overflow = ""; }; }, [index, change]);
  useEffect(() => { if (!auto || index === null) return; const timer = window.setInterval(() => change(1), 3500); return () => window.clearInterval(timer); }, [auto, index, change]);
  return <><section id="gallery" className="surfaceSection sectionSpace"><div className="sectionShell"><SectionHeading eyebrow="GALLERY" title="Moments in Full Screen" text="A few favourite frames from the beautiful journey that brought us here." /><div className="premiumGallery">{d.images.gallery.map((image, imageIndex) => <motion.button key={image.src} onClick={() => setIndex(imageIndex)} className="galleryTile" initial={{ opacity: 0, y: 38, scale: .95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .75, delay: imageIndex * .07, ease }} whileHover={{ scale: 1.015 }} aria-label={`Open photo ${imageIndex + 1}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 50vw, 33vw" style={{ objectFit: "cover" }} /><span>↗</span></motion.button>)}</div></div></section><AnimatePresence>{index !== null && <motion.div className="premiumLightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onTouchStart={event => { touch.current = event.touches[0].clientX; }} onTouchEnd={event => { const delta = event.changedTouches[0].clientX - touch.current; if (Math.abs(delta) > 45) change(delta < 0 ? 1 : -1); }}><motion.div className={`lightboxImage ${zoom ? "zoomed" : ""}`} key={index} initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setZoom(value => !value)}><Image src={d.images.gallery[index].src} alt={d.images.gallery[index].alt} fill sizes="100vw" style={{ objectFit: "contain" }} /></motion.div><div className="lightboxTools"><button onClick={() => setIndex(null)} aria-label="Close">×</button><button onClick={() => setZoom(value => !value)} aria-label="Zoom">{zoom ? "−" : "+"}</button><button onClick={() => setAuto(value => !value)} aria-label="Slideshow">{auto ? "Ⅱ" : "▶"}</button></div><button className="lightboxPrev" onClick={() => change(-1)} aria-label="Previous">‹</button><button className="lightboxNext" onClick={() => change(1)} aria-label="Next">›</button><span className="lightboxCount">{index + 1} / {d.images.gallery.length}</span></motion.div>}</AnimatePresence></>;
}

function WeddingCamera() {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [frame, setFrame] = useState<"classic" | "botanical" | "cinema">("classic");
  const [countdown, setCountdown] = useState(0);
  const [flash, setFlash] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => { streamRef.current?.getTracks().forEach(track => track.stop()); streamRef.current = null; }, []);
  const startCamera = useCallback(async (mode: "user" | "environment") => {
    stopCamera(); setError(""); setPhoto("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
    } catch { setError("Camera access is needed to create your wedding photo."); }
  }, [stopCamera]);
  useEffect(() => { if (open) void startCamera(facing); else stopCamera(); return stopCamera; }, [open, facing, startCamera, stopCamera]);

  const capture = async () => {
    const video = videoRef.current; if (!video?.videoWidth) return;
    for (const count of [3, 2, 1]) { setCountdown(count); await new Promise(resolve => window.setTimeout(resolve, 650)); }
    setCountdown(0); setFlash(true); window.setTimeout(() => setFlash(false), 260);
    const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    if (facing === "user") { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (facing === "user") ctx.setTransform(1, 0, 0, 1, 0, 0);
    const unit = Math.min(canvas.width, canvas.height); const cx = canvas.width / 2;
    ctx.strokeStyle = frame === "cinema" ? "rgba(255,255,255,.92)" : "rgba(224,184,91,.92)"; ctx.lineWidth = Math.max(3, unit * .006); ctx.strokeRect(unit * .035, unit * .035, canvas.width - unit * .07, canvas.height - unit * .07);
    if (frame === "botanical") { ctx.font = `${unit * .07}px Georgia`; ctx.textAlign = "left"; ctx.fillText("❦", unit * .055, unit * .11); ctx.textAlign = "right"; ctx.fillText("❦", canvas.width - unit * .055, canvas.height - unit * .065); }
    ctx.textAlign = "center"; ctx.fillStyle = "#fffaf0"; ctx.shadowColor = "rgba(25,18,10,.7)"; ctx.shadowBlur = unit * .018;
    ctx.font = `italic 500 ${unit * .095}px Georgia, serif`; ctx.fillText(`${d.bride.firstName} & ${d.groom.firstName}`, cx, canvas.height - unit * .12);
    ctx.font = `600 ${unit * .026}px Arial, sans-serif`; ctx.letterSpacing = `${unit * .008}px`; ctx.fillText(frame === "cinema" ? "OUR FOREVER · A & J" : "CELEBRATING FOREVER", cx, canvas.height - unit * .065);
    setPhoto(canvas.toDataURL("image/jpeg", .92)); stopCamera();
  };
  const close = () => { setOpen(false); setPhoto(""); setError(""); };

  return <><section className="weddingCameraSection sectionSpace"><div className="cameraAura" aria-hidden="true" /><div className="sectionShell cameraInvite"><div><p className="eyebrow">A MEMORY WITH US</p><h2>Create Your Wedding Portrait</h2><p>Choose a signature frame, open your camera, and capture a keepsake from our celebration.</p></div><button className="darkButton" onClick={() => setOpen(true)}>OPEN WEDDING CAMERA <span>→</span></button></div></section><AnimatePresence>{open && <motion.div className="cameraModal" role="dialog" aria-modal="true" aria-label="Wedding camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="cameraStage" initial={{ y: 24, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: .98 }}><button className="cameraClose" onClick={close} aria-label="Close camera">×</button>{photo ? <img className="capturedPhoto" src={photo} alt="Your framed wedding photograph" /> : <div className={`cameraView ${facing === "user" ? "mirrored" : ""}`}><video ref={videoRef} playsInline muted /><div className={`cameraFrame ${frame}`}><i className="frameCorner topLeft" /><i className="frameCorner bottomRight" /><span className="cameraMonogram">A <i>&amp;</i> J</span><small>{frame === "cinema" ? "OUR FOREVER · A & J" : "CELEBRATING FOREVER"}</small></div>{countdown > 0 && <motion.strong className="cameraCountdown" key={countdown} initial={{ opacity: 0, scale: .5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.35 }}>{countdown}</motion.strong>}{flash && <motion.i className="cameraFlash" initial={{ opacity: 1 }} animate={{ opacity: 0 }} />}</div>}{error && <p className="cameraError" role="alert">{error}</p>}{!photo && <div className="framePicker" aria-label="Choose photo frame">{(["classic", "botanical", "cinema"] as const).map(option => <button key={option} className={frame === option ? "active" : ""} onClick={() => setFrame(option)}>{option}</button>)}</div>}<div className="cameraControls">{photo ? <><button onClick={() => void startCamera(facing)}>RETAKE</button><a href={photo} download="anuja-jeremy-wedding-frame.jpg">DOWNLOAD PHOTO</a></> : <><button onClick={() => setFacing(value => value === "user" ? "environment" : "user")}>↻ SWITCH</button><button className="captureButton" onClick={() => void capture()} disabled={countdown > 0} aria-label="Take photo"><i /></button><span className="cameraHint">HOLD STILL</span></>}</div></motion.div></motion.div>}</AnimatePresence></>;
}

function RSVPSection() {
  const [done, setDone] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  useEffect(() => { setDone(localStorage.getItem("wedify-rsvp-submitted") === "yes"); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); const form = event.currentTarget; const body = Object.fromEntries(new FormData(form).entries()); try { const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); localStorage.setItem("wedify-rsvp-submitted", "yes"); setDone(true); } catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); } finally { setLoading(false); } }
  return <section id="rsvp" className="patternSection sectionSpace"><div className="sectionShell rsvpLayout"><SectionHeading align="left" eyebrow="RSVP" title="Reserve Your Blessing Seat" text={`Kindly respond before ${new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(weddingDate.getTime() - 14 * 86400000))}.`} /><motion.div className="glassPanel rsvpPanel" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>{done ? <div className="thankYou"><span>✓</span><h3>Thank you for responding</h3><p>We cannot wait to celebrate with you.</p></div> : <form onSubmit={submit}><label><span>Your name</span><div className="signatureInput"><input name="name" type="text" placeholder="Write your full name" required autoComplete="name" /><i aria-hidden="true">✦</i></div></label><label>Number of guests<input name="guests" type="number" min="1" max="10" defaultValue="1" required /></label><fieldset><legend>Will you be attending?</legend><div className="choiceGrid"><label><input type="radio" name="attendance" value="Joyfully Accept" required /><span>Joyfully Accept</span></label><label><input type="radio" name="attendance" value="Regretfully Decline" /><span>Regretfully Decline</span></label></div></fieldset><fieldset><legend>Which celebration?</legend><div className="choiceGrid three"><label><input type="radio" name="eventSelection" value="Engagement" required /><span>Engagement</span></label><label><input type="radio" name="eventSelection" value="Wedding" /><span>Wedding</span></label><label><input type="radio" name="eventSelection" value="Both" /><span>Both</span></label></div></fieldset>{error && <p className="formError" role="alert">{error}</p>}<button className="darkButton" disabled={loading}>{loading ? "SENDING…" : "CONFIRM RSVP"}</button></form>}</motion.div></div></section>;
}

function SaveTheDateFilm({ onEnterVideo, onLeaveVideo }: { onEnterVideo: () => void; onLeaveVideo: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const filmAudio = useRef<HTMLAudioElement>(null);
  const audioFade = useRef<number | null>(null);
  const soundUnlocked = useRef(false);
  const filmActive = useRef(false);
  const [soundRequired, setSoundRequired] = useState(true);
  const stopAudioFade = useCallback(() => { if (audioFade.current !== null) { window.clearInterval(audioFade.current); audioFade.current = null; } }, []);
  const fadeFilmAudioIn = useCallback(async () => { const sound = filmAudio.current; const picture = video.current; if (!sound || !picture) return; stopAudioFade(); await new Promise(resolve => window.setTimeout(resolve, 650)); if (!filmActive.current) return; sound.currentTime = picture.currentTime; sound.volume = 0; await sound.play(); audioFade.current = window.setInterval(() => { sound.volume = Math.min(1, sound.volume + .1); if (sound.volume >= 1) stopAudioFade(); }, 65); }, [stopAudioFade]);
  const enableSound = useCallback(() => { const sound = filmAudio.current; const picture = video.current; if (!sound || !picture) return; soundUnlocked.current = true; onEnterVideo(); sound.muted = false; void fadeFilmAudioIn().then(() => setSoundRequired(false)).catch(() => setSoundRequired(true)); }, [fadeFilmAudioIn, onEnterVideo]);
  useEffect(() => { const picture = video.current; const sound = filmAudio.current; const section = picture?.closest("#film") as HTMLElement | null; if (!picture || !sound || !section) return; let active = false; let frame = 0; const deactivate = () => { active = false; filmActive.current = false; stopAudioFade(); sound.pause(); sound.volume = 0; picture.pause(); onLeaveVideo(); }; const activate = () => { active = true; filmActive.current = true; onEnterVideo(); picture.muted = true; void picture.play(); if (soundUnlocked.current) { setSoundRequired(false); void fadeFilmAudioIn(); } else setSoundRequired(true); }; const checkPosition = () => { frame = 0; const rect = section.getBoundingClientRect(); const shouldPlay = rect.top < window.innerHeight * .78 && rect.bottom > window.innerHeight * .22; if (shouldPlay === active) return; if (shouldPlay) activate(); else deactivate(); }; const scheduleCheck = () => { if (!frame) frame = window.requestAnimationFrame(checkPosition); }; const ended = () => deactivate(); window.addEventListener("scroll", scheduleCheck, { passive: true }); window.addEventListener("resize", scheduleCheck); picture.addEventListener("ended", ended); checkPosition(); return () => { if (frame) window.cancelAnimationFrame(frame); filmActive.current = false; stopAudioFade(); sound.pause(); picture.pause(); window.removeEventListener("scroll", scheduleCheck); window.removeEventListener("resize", scheduleCheck); picture.removeEventListener("ended", ended); }; }, [fadeFilmAudioIn, onEnterVideo, onLeaveVideo, stopAudioFade]);
  return <section id="film" className="filmSection sectionSpace"><div className="sectionShell filmLayout"><motion.div className="filmCopy" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><p className="eyebrow">OUR SAVE THE DATE</p><h2>A Little Glimpse<br />of Forever</h2><p>Our story, captured in motion—a little glimpse of the beautiful journey ahead.</p><div className="filmDate"><span>{formatDate(d.wedding.date, true)}</span><i /> <span>{d.bride.firstName} &amp; {d.groom.firstName}</span></div></motion.div><motion.div className="filmFrame" initial={{ opacity: 0, y: 35, scale: .97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .2 }} onPointerDown={soundRequired ? enableSound : undefined}><video ref={video} muted playsInline preload="metadata" poster="/video/save-the-date-poster.jpg"><source src="/video/save-the-date.mp4" type="video/mp4" />Your browser does not support this video.</video><audio ref={filmAudio} preload="auto" src="/video/save-the-date-audio.mp3" />{soundRequired && <button type="button" className="videoSoundPrompt" onPointerDown={event => { event.stopPropagation(); enableSound(); }}>♪ PLAY VIDEO SOUND</button>}</motion.div></div></section>;
}

function ContactSection() {
  return <section id="contact" className="thankYouSection"><CinematicImage src="/images/thank-you.jpg" alt={`${d.bride.firstName} and ${d.groom.firstName} at the altar`} sizes="100vw" position="center 48%" /><div className="thankYouShade" /><motion.div className="thankYouCopy" initial={{ opacity: 0, y: -24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }}><p className="eyebrow">WITH HEARTFELT GRATITUDE</p><h2>Thank You<br />for Your Presence</h2><span>Your love, prayers, and blessings make our celebration complete.</span><div className="thankYouNames">{d.bride.firstName} <i>&amp;</i> {d.groom.firstName}</div></motion.div></section>;
}

function Footer() {
  return <footer className="premiumFooter"><div><Image src={d.wedify.logo} alt={d.wedify.name} width={220} height={64} /><a href={d.wedify.instagram} target="_blank" rel="noreferrer">@wedify_invites</a></div><span>×</span><div><small>PHOTOGRAPHY BY</small><div className="footerPhotoLogo"><Image src={d.photographer.logo} alt={d.photographer.name} fill sizes="180px" /></div><a href={d.photographer.instagram} target="_blank" rel="noreferrer">@tj_photography_1</a></div></footer>;
}

function FloatingActions({ playing, toggleMusic }: { playing: boolean; toggleMusic: () => void }) {
  const [copied, setCopied] = useState(false);
  const share = () => { const url = window.location.href; const text = d.shareText.replace("{url}", url); if (navigator.share) void navigator.share({ title: `${d.bride.firstName} & ${d.groom.firstName}`, text, url }); else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer"); };
  const copy = async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <><div className="floatingActions"><button className="darkAction" onClick={toggleMusic} aria-label={playing ? "Pause music" : "Play music"}><span className={playing ? "musicBars active" : "musicBars"}><i /><i /><i /></span></button><a className="goldAction" href="#rsvp" aria-label="RSVP">♡</a><button onClick={share} aria-label="Share">↗</button><button onClick={() => void copy()} aria-label="Copy link">⌁</button></div>{copied && <div className="copyToast">Invitation link copied</div>}</>;
}

export default function Home() {
  const [entered, setEntered] = useState(false); const [playing, setPlaying] = useState(false); const [videoActive, setVideoActive] = useState(false); const audio = useRef<HTMLAudioElement>(null); const fade = useRef<number | null>(null); const fadeFrame = useRef<number | null>(null); const musicUnlocked = useRef(false); const videoActiveRef = useRef(false);
  const stopFade = useCallback(() => { if (fade.current !== null) { window.clearInterval(fade.current); fade.current = null; } }, []);
  const stopFadeFrame = useCallback(() => { if (fadeFrame.current !== null) { window.cancelAnimationFrame(fadeFrame.current); fadeFrame.current = null; } }, []);
  const startMusic = useCallback(async () => { const element = audio.current; if (!element || videoActiveRef.current) return false; stopFade(); let volume = element.paused ? .05 : element.volume; element.volume = volume; try { if (element.paused) await element.play(); if (videoActiveRef.current) { element.pause(); return false; } musicUnlocked.current = true; setPlaying(true); fade.current = window.setInterval(() => { volume = Math.min(.5, volume + .04); element.volume = volume; if (volume >= .5) stopFade(); }, 90); return true; } catch { setPlaying(false); return false; } }, [stopFade]);
  const toggleMusic = useCallback(() => { const element = audio.current; if (!element || videoActiveRef.current) return; if (element.paused) void startMusic(); else { stopFade(); element.pause(); setPlaying(false); } }, [startMusic, stopFade]);
  const enterVideo = useCallback(() => { videoActiveRef.current = true; setVideoActive(true); const element = audio.current; if (!element || element.paused) return; stopFade(); stopFadeFrame(); const from = element.volume; const started = performance.now(); const step = (now: number) => { const progress = Math.min(1, (now - started) / 420); element.volume = Math.max(0, from * (1 - progress)); if (progress < 1 && videoActiveRef.current) fadeFrame.current = window.requestAnimationFrame(step); else { element.pause(); element.volume = .05; setPlaying(false); fadeFrame.current = null; } }; fadeFrame.current = window.requestAnimationFrame(step); }, [stopFade, stopFadeFrame]);
  const leaveVideo = useCallback(() => { if (!videoActiveRef.current) return; videoActiveRef.current = false; setVideoActive(false); stopFadeFrame(); if (musicUnlocked.current) void startMusic(); }, [startMusic, stopFadeFrame]);
  useEffect(() => { if (!entered || playing || videoActive || musicUnlocked.current) return; const unlock = () => { if (!videoActiveRef.current) void startMusic(); }; window.addEventListener("pointerdown", unlock, { once: true }); return () => window.removeEventListener("pointerdown", unlock); }, [entered, playing, videoActive, startMusic]);
  useEffect(() => () => { stopFade(); stopFadeFrame(); }, [stopFade, stopFadeFrame]);
  return <MotionConfig reducedMotion="never" transition={{ duration: .7, ease }}><main><audio ref={audio} src={d.music} loop preload="auto" playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><AnimatePresence mode="wait">{!entered && <Intro key="intro" onEnter={() => setEntered(true)} onMusic={startMusic} />}</AnimatePresence>{entered && <motion.div className="siteContent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ScrollProgress /><Navigation />{!playing && !videoActive && <motion.button className="musicNudge" onClick={() => void startMusic()} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}><span>♪</span><i><b>Wedding music</b><small>Tap to play</small></i></motion.button>}<Hero /><CountdownSection /><CoupleSection /><StorySection /><RingsTransition /><EventsSection /><GallerySection /><WeddingCamera /><RSVPSection /><SaveTheDateFilm onEnterVideo={enterVideo} onLeaveVideo={leaveVideo} /><ContactSection /><Footer /><FloatingActions playing={playing} toggleMusic={toggleMusic} /></motion.div>}</main></MotionConfig>;
}
