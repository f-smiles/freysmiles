"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronDownIcon, MailIcon, MoveRightIcon, PhoneIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { RequestJoinTeamSchema } from "@/types/request-join-team-schema";
import { requestJoinTeam } from "@/server/actions/request-join-team";
import { CopyButton } from "@/components/ui/shadcn-io/copy-button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

gsap.registerPlugin(SplitText);

export default function BookNow() {
  const containerOneRef = useRef(null);
  const h1Ref = useRef(null);
  const telephone = "610-437-4748";
  const email = "info@freysmiles.com";
  
  useEffect(() => {
    if (!h1Ref.current) return;
    
    const split = SplitText.create(h1Ref.current, { types: "chars" });
    const chars = split.chars;
    
    gsap.set(chars, {
      y: 100,
      rotation: 2,    
      opacity: 0,
      force3D: true
    });

    gsap.to(chars, {
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 1,    
      ease: "power3.inOut",
      stagger: 0.1,   
    });

    return () => split.revert();
  }, []);

  return (
    <div className="flex flex-col w-full md:flex-row">
      <section className="relative z-10 w-full h-[100dvh] flex flex-col items-center justify-center text-white p-8 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <Canvas
            orthographic
            camera={{ zoom: 1, position: [0, 0, 1] }}
            className="w-full h-full"
          >
            <ShaderBackground />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute w-[400px] h-[400px] border border-white/35 rounded-full top-[100px] right-10" />
          <div className="absolute w-[450px] h-[450px] border border-white/30 rounded-full bottom-[60px] left-0" />
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-0">
          <div className="circle-loader relative">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`circle circle-${i}`} />
            ))}
          </div>
        </div>

        <div ref={containerOneRef} className="z-10 absolute top-1/2 -translate-y-1/2 pb-[0.1em] overflow-hidden">
          <h1 ref={h1Ref} className="text-[32px] font-canela-italic italic text-center leading-[1.2em] lowercase lg:text-[34px]">Website Coming Soon</h1>
          <Link prefetch={false} href="#acuity-calendar" className="mt-[14px] flex flex-col items-center justify-center text-center font-canela uppercase text-[16px] md:hidden">
            Book Now
            <ChevronDown className="animate-bounce size-5" />
          </Link>
        </div>

        <div className="absolute top-[80%] right-8 -translate-y-1/2 font-neuehaas35 text-[14px] text-left leading-relaxed z-10 lg:text-[16px]">
          <div className="flex flex-col gap-3 items-end">
            <div className="flex items-center justify-between rounded-full border border-zinc-50/50 pr-1">
              <CopyButton content={telephone} className="w-full rounded-full px-3 py-2 bg-transparent tracking-wider hover:bg-transparent">
                <p>{telephone}</p>
                <span className="sr-only">Copy FreySmiles phone number to clipboard: {telephone}</span>
              </CopyButton>
            </div>
            <div className="flex items-center justify-between rounded-full border border-zinc-50/50 pr-1">
              <CopyButton content={email} className="w-full rounded-full px-3 py-2 bg-transparent tracking-wider hover:bg-transparent">
                <p>{email}</p>
                <span className="sr-only">Copy FreySmiles e-mail to clipboard: {email}</span>
              </CopyButton>
            </div>
            <div className="font-neuehaas45 py-2 px-4 z-10">
              <JoinOurTeam />
            </div>
          </div>
        </div>
      </section>

      <div id="acuity-calendar" className="acuity-font w-full h-[100dvh] flex items-center justify-center bg-white">
        <iframe
          src={process.env.NEXT_PUBLIC_ACUITY_SCHEDULING_SRC}
          title="Schedule Appointment"
          width="100%"
          height="100%"
          frameBorder="0"
          allow="payment"
          className="border-0"
        ></iframe>
      </div>
    </div>
  );
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #define S(a,b,t) smoothstep(a,b,t)
  precision mediump float;
  
  uniform float iTime;
  uniform vec3 iResolution;
  varying vec2 vUv;

  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
    return fract(sin(p)*43758.5453);
  }

  float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f*f*(3.0-2.0*f);

    float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                   mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    return 0.5 + 0.5*n;
  }

  void main() {
    vec2 fragCoord = vec2(vUv.x * iResolution.x, vUv.y * iResolution.y);
    vec2 uv = fragCoord / iResolution.xy;

    float ratio = iResolution.x / iResolution.y;
    vec2 tuv = uv - 0.5;

    float degree = noise(vec2(iTime*.1, tuv.x*tuv.y));
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - .5) * 720. + 60.0));
    tuv.y *= ratio;

    // --- Soft wave drifting ---
    float frequency = 2.;
    float amplitude = 35.;
    float speed = iTime * 3.;

    tuv.x += sin(tuv.y * frequency + speed) / amplitude;
    tuv.y += sin(tuv.x * (frequency * 1.4) + speed) / (amplitude * .5);

    vec3 cold1 = vec3(0.86, 0.87, 0.94);
    vec3 cold2 = vec3(0.75, 0.76, 0.84);
    vec3 cold3 = vec3(0.66, 0.67, 0.73);

    vec3 warm1 = vec3(1.00, 0.55, 0.85); 
    vec3 warm2 = vec3(0.95, 0.72, 1.00);

    // vec3 warm1 = vec3(1.00, 0.68, 0.90); // airy blush
    // vec3 warm2 = vec3(0.95, 0.82, 1.00); // lavender-white

    // vec3 warm1 = vec3(1.00, 0.55, 0.85); // hot pink
    // vec3 warm2 = vec3(0.95, 0.77, 1.00); // lavender pink

    vec3 layer1 = mix(cold1, cold2, S(-0.5, 0.3, (tuv * Rot(radians(-5.))).x));
    layer1 = mix(layer1, cold3, S(-0.1, 0.7, (tuv * Rot(radians(-5.))).x));

    vec3 layer2 = mix(cold2, cold3, S(-0.8, 0.2, (tuv * Rot(radians(-5.))).x));
    layer2 = mix(layer2, cold1, S(-0.2, 0.9, (tuv * Rot(radians(-5.))).x));

    float dist = length(tuv * vec2(1.2, 1.0));
    float glow = smoothstep(0.7, 0.0, dist);    // soft radial falloff
    glow = pow(glow, 1.8);                     // softer edge

    vec3 warmGlow = mix(warm1, warm2, glow);

    vec3 base = mix(layer1, layer2, S(.6, -.4, tuv.y));
    vec3 col = mix(base, warmGlow, glow * 1.3);

    col = mix(col, vec3(0.98, 0.97, 1.0), 0.05);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderBackground() {
  const materialRef = useRef();
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.iResolution.value.set(size.width, size.height, 1);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3() }
        }}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}

const CanvasBallsAnimation = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();


    const BALL_COUNT = 38;
    const R = 2;
    const maxDistance = 260;
    const lineWidth = 0.6;

    const ballColor = { r: 254, g: 180, b: 74 };

    const speedRange = 0.35;  // slower 

    let balls = [];

    const random = (min, max) => Math.random() * (max - min) + min;

    const createBall = () => ({
      x: random(0, width),
      y: random(0, height),
      vx: random(-speedRange, speedRange),
      vy: random(-speedRange, speedRange),
      r: R,
      alpha: random(0.4, 0.8),
    });

    const initBalls = () => {
      balls = [];
      for (let i = 0; i < BALL_COUNT; i++) {
        balls.push(createBall());
      }
    };

    const distance = (a, b) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.hypot(dx, dy);
    };

    const updateBalls = () => {
      balls.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;

        // soft wrap
        if (b.x < -50) b.x = width + 50;
        if (b.x > width + 50) b.x = -50;
        if (b.y < -50) b.y = height + 50;
        if (b.y > height + 50) b.y = -50;
      });
    };

    const drawLines = () => {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i];
          const b2 = balls[j];

          const dist = distance(b1, b2);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.2; 

            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = lineWidth;

            ctx.beginPath();
            ctx.moveTo(b1.x, b1.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.stroke();
          }
        }
      }
    };

    const drawBalls = () => {
      balls.forEach((b) => {
        ctx.fillStyle = `rgba(${ballColor.r}, ${ballColor.g}, ${ballColor.b}, ${b.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawLines();
      drawBalls();
      updateBalls();

      animationRef.current = requestAnimationFrame(animate);
    };

    initBalls();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

function JoinOurTeam() {

  const [open, setOpen] = useState(false);
  const [resumeName, setResumeName] = useState("");

  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  const form = useForm({
    resolver: zodResolver(RequestJoinTeamSchema),
    defaultValues: {
      name: "",
      contactInfo: {
        type: "email",
        value: "",
      },
      highSchoolGraduationYear: "",
      priorDentistryExperience: "",
      positionOfInterest: "",
      heardFrom: "",
      availabilityToStart: "",
      availabilityLocations: "",
      resume: {
        filename: "",
        content: "",
      },
      questionResponse: "",
      additionalInfo: "",
    },
    mode: "onChange",
  })

  const [contactInfoSelect, setContactInfoSelect] = useState("email")

  const handleContactInfoSelectChange = (val) => {
    setContactInfoSelect(val)
    form.setValue("contactInfo", { type: val, value: "" })
    form.clearErrors("contactInfo")
  }

  useEffect(() => {
    console.log(contactInfoSelect)
  }, [contactInfoSelect])

  const { execute, status } = useAction(requestJoinTeam, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error)
      if (data?.success) {
        form.reset()
        setOpen(false)
        toast.success(data.success)
      }
    },
    onError(error) {
      console.error(error)
    }
  })

  const onSubmit = (values) => {
    console.log(values)
    execute(values)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group"
      >
        <div className="flex flex-col items-end">
          <span className="font-neuehaas45 tracking-wide">Join Our Team</span>
          <span className="font-canela-italic tracking-wide flex items-center gap-3">
            <MoveRightIcon className="size-4 transition-all duration-150 group-hover:animate-left-right" />
            We're Hiring
          </span>
        </div>
      </button>
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  exit: {
                    opacity: {
                      duration: 1.2, 
                      ease: [0.22, 1, 0.36, 1]
                    },
                    backdropFilter: {
                      duration: 0.4 
                    }
                  }
                }}
                className="fixed inset-0 z-50 bg-black/80 
                          flex items-center justify-center
                          font-neuehaas45 tracking-wide"
                onClick={handleClose}
              >
                <motion.div
                  key="panel"
                  initial={{
                    clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                    scale: 0.9,
                    opacity: 0
                  }}
                  animate={{
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    scale: 1,
                    opacity: 1
                  }}
                  exit={{
                    clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                    scale: 0.92,
                    opacity: 0
                  }}
                  transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    clipPath: { 
                      duration: 1.4,
                      ease: [0.34, 1.56, 0.64, 1]
                    },
                    scale: {
                      duration: 0.8,
                      ease: "backOut"
                    },
                    opacity: {
                      duration: 1.0
                    }
                  }}
                  className="relative w-full h-full 
                            bg-gradient-to-br
                            from-[#4E5353]
                            via-[#505456]
                            to-[#3E4243]
                            text-white 
                            flex items-start justify-center
                            overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute inset-0 pointer-events-none z-[1]">
                    <CanvasBallsAnimation />
                  </div>
    
                  <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-noise z-[2]" />
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="relative z-[3] w-full"
                  >
                    <button
                      type="button"
                      onClick={handleClose}
                      className="absolute top-8 right-8 text-sm opacity-70 hover:opacity-100 
                                transition-opacity focus:outline-none focus:ring-2 focus:ring-white/30 
                                rounded px-2 py-1"
                    >
                      ✕ Close
                    </button>
                    
                    <div className="w-full px-12 md:px-20 pt-14 md:pt-20 mb-8">
                      <motion.h2
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-[28px] font-canela-italic mb-10"
                      >
                        Start Your Application{" "}
                        <span className="opacity-50 font-canela mx-2">—</span>
                        <span className="text-[14px] tracking-wide opacity-70 align-middle font-neuehaas45 text-[#FEB44A]">
                          Drop us your info and we'll reach out
                        </span>
                      </motion.h2>
                      
                      <Form {...form}>
                        <form
                          // onSubmit={form.handleSubmit(onSubmit, (errors) => console.error("Validation errors: ", errors))}
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="w-full grid grid-cols-1 xl:grid-cols-2 gap-x-20 gap-y-8"
                        >
                          {/* LEFT COLUMN */}
                          <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-8"
                          >
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                                        Full Name
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          required
                                          placeholder="Jane Doe"
                                          className="w-full bg-transparent border border-white/20 rounded-lg 
                                                    px-4 py-3 
                                                    text-[12px] leading-relaxed
                                                    text-white/85
                                                    placeholder:text-white/35
                                                    tracking-[0.01em]
                                                    focus:outline-none focus:border-white/60
                                                    transition-colors"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.65 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="contactInfo"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel
                                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                                        htmlFor="form-applicant-contact-method"
                                      >
                                        Best way to reach you
                                      </FormLabel>
                                      <FormControl>
                                        <div className="flex items-center gap-2">
                                          <Select
                                            defaultValue="email"
                                            value={contactInfoSelect}
                                            onValueChange={handleContactInfoSelectChange}
                                            id="form-applicant-contact-method"
                                            className="w-full bg-transparent border border-white/20 rounded-lg 
                                                    px-4 py-3 
                                                    text-[12px] leading-relaxed
                                                    text-white/85
                                                    placeholder:text-white/35
                                                    tracking-[0.01em]
                                                    focus:outline-none focus:border-white/60
                                                    transition-colors"
                                          >
                                            <SelectTrigger
                                              className="w-max text-xs border border-white/20 data-[placeholder]:text-white/85"
                                              id="form-applicant-contact-method"
                                            >
                                              <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel>Method</SelectLabel>
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="phone">Phone</SelectItem>
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                          <Input
                                            required
                                            type={contactInfoSelect === "email" ? "email" : "tel"}
                                            placeholder={contactInfoSelect === "email" ? "Email address" : "Phone number"}
                                            value={field.value.value}
                                            onChange={(e) => field.onChange({
                                              type: contactInfoSelect,
                                              value: e.target.value,
                                            })}
                                            className="text-[12px] leading-relaxed
                                                      text-white/85
                                                      placeholder:text-white/35 opacity-70  
                                                      w-full bg-transparent border border-white/20 rounded-lg 
                                                      px-4 py-3 focus:outline-none focus:border-white/60
                                                      transition-colors"
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="highSchoolGraduationYear"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel
                                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                                        htmlFor="form-applicant-high-school-graduation-year"
                                      >
                                        High School Graduation Year
                                      </FormLabel>
                                      <FormControl>
                                        <Select
                                          required
                                          onValueChange={field.onChange}
                                          value={field.value?.toString()}
                                          className="w-full bg-transparent border border-white/20 rounded-lg 
                                                    px-4 py-3 
                                                    text-[12px] leading-relaxed
                                                    text-white/85
                                                    placeholder:text-white/35
                                                    tracking-[0.01em]
                                                    focus:outline-none focus:border-white/60
                                                    transition-colors"
                                          {...field}
                                        >
                                          <SelectTrigger
                                            className="border border-white/20 data-[placeholder]:text-white/85"
                                            id="form-applicant-high-school-graduation-year"
                                          >
                                            <SelectValue placeholder="Select year" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>Year</SelectLabel>
                                              {Array.from({ length: 40 }, (_, i) => {
                                                const year = (2027 - i).toString()
                                                return <SelectItem key={`${i}-${year}`} value={year}>{year}</SelectItem>
                                              })}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.75 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="priorDentistryExperience"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel
                                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                                        htmlFor="form-applicant-prior-experience-in-dentistry"
                                      >
                                        Do you have experience working in dentistry or orthodontics?
                                      </FormLabel>
                                      <FormControl>
                                        <Select
                                          required
                                          onValueChange={field.onChange}
                                          value={field.value}
                                          className="w-full bg-transparent border border-white/20 rounded-lg 
                                                    px-4 py-3 
                                                    text-[12px] leading-relaxed
                                                    text-white/85
                                                    placeholder:text-white/35
                                                    tracking-[0.01em]
                                                    focus:outline-none focus:border-white/60
                                                    transition-colors"
                                          {...field}
                                        >
                                          <SelectTrigger
                                            className="border border-white/20 data-[placeholder]:text-white/85"
                                            id="form-applicant-prior-experience-in-dentistry"
                                          >
                                            <SelectValue placeholder="Select yes or no" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>Select</SelectLabel>
                                              <SelectItem value="yes">Yes</SelectItem>
                                              <SelectItem value="no">No</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="positionOfInterest"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel
                                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                                        htmlFor="form-applicant-position-of-interest"
                                      >
                                        Position you're interested in
                                      </FormLabel>
                                      <FormControl>
                                        <Select
                                          required
                                          onValueChange={field.onChange}
                                          value={field.value}
                                          className="w-full bg-transparent border border-white/20 rounded-lg 
                                                    px-4 py-3 
                                                    text-[12px] leading-relaxed
                                                    text-white/85
                                                    placeholder:text-white/35
                                                    tracking-[0.01em]
                                                    focus:outline-none focus:border-white/60
                                                    transition-colors"
                                          {...field}
                                        >
                                          <SelectTrigger
                                            className="border border-white/20 data-[placeholder]:text-white/85"
                                            id="form-applicant-position-of-interest"
                                          >
                                            <SelectValue placeholder="Select role" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>Role</SelectLabel>
                                              <SelectItem value="assistant">Clinical Assistant</SelectItem>
                                              <SelectItem value="front-desk">Front Desk / Admin</SelectItem>
                                              <SelectItem value="coordinator">Treatment Coordinator</SelectItem>
                                              <SelectItem value="sterilization">Sterilization / Lab</SelectItem>
                                              <SelectItem value="open">Open / Unsure</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.85 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="heardFrom"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel
                                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                                        htmlFor="form-applicant-how-did-you-hear-about-us"
                                      >
                                        How did you hear about us?
                                      </FormLabel>
                                      <FormControl>
                                        <Select
                                          required
                                          onValueChange={field.onChange}
                                          value={field.value}
                                          className="w-full bg-transparent border border-white/20 rounded-lg 
                                                    px-4 py-3 
                                                    text-[12px] leading-relaxed
                                                    text-white/85
                                                    placeholder:text-white/35
                                                    tracking-[0.01em]
                                                    focus:outline-none focus:border-white/60
                                                    transition-colors"
                                          {...field}
                                        >
                                          <SelectTrigger
                                            className="border border-white/20 data-[placeholder]:text-white/85"
                                            id="form-applicant-how-did-you-hear-about-us"
                                          >
                                            <SelectValue placeholder="Select source" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>Source</SelectLabel>
                                              <SelectItem value="website">Website</SelectItem>
                                              <SelectItem value="social">Social Media</SelectItem>
                                              <SelectItem value="friend">Friend / Employee</SelectItem>
                                              <SelectItem value="other">Other</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="availabilityToStart"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                                        When would you be available to start?
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          required
                                          placeholder="Immediately, in 2 weeks, next month, etc..."
                                          className="text-[12px] leading-relaxed
                                                      text-white/85
                                                      placeholder:text-white/35 opacity-70  
                                                      w-full bg-transparent border border-white/20 rounded-lg 
                                                      px-4 py-3 focus:outline-none focus:border-white/60
                                                      transition-colors"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>

                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.75 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="availabilityLocations"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel
                                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                                        htmlFor="form-applicant-available-to-work-all-4-locations-allentown-bethlehem-lehighton-schnecksville"
                                      >
                                        {`Would you be available to work all 4 of our locations? (Allentown, Bethlehem, Lehighton, Schnecksville)`}
                                      </FormLabel>
                                      <FormControl>
                                        <Select
                                          required
                                          onValueChange={field.onChange}
                                          value={field.value}
                                          className="w-full bg-transparent border border-white/20 rounded-lg 
                                                    px-4 py-3 
                                                    text-[12px] leading-relaxed
                                                    text-white/85
                                                    placeholder:text-white/35
                                                    tracking-[0.01em]
                                                    focus:outline-none focus:border-white/60
                                                    transition-colors"
                                          {...field}
                                        >
                                          <SelectTrigger 
                                            className="border border-white/20 data-[placeholder]:text-white/85"
                                            id="form-applicant-available-to-work-all-4-locations-allentown-bethlehem-lehighton-schnecksville"
                                          >
                                            <SelectValue placeholder="Select yes or no" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>Select</SelectLabel>
                                              <SelectItem value="yes">Yes</SelectItem>
                                              <SelectItem value="no">No</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            </div>
                          </motion.div>

                          {/* RIGHT COLUMN */}
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.55 }}
                            className="space-y-8"
                          >
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.95 }}
                            >
                              <FormField
                                control={form.control}
                                name="resume"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel
                                      className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                                      htmlFor="form-applicant-resume-pdf-preferred-accept-doc-docx"
                                    >
                                      {`Resume (PDF Preferred)`}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        required
                                        id="form-applicant-resume-pdf-preferred-accept-doc-docx"
                                        className="text-[12px] leading-relaxed
                                                  opacity-70 file:text-white/85
                                                text-white/85 placeholder:text-white/35
                                                  border border-white/30 hover:border-white
                                                  cursor-pointer transition-colors"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0]
                                          if (file) {
                                            const arrayBuffer = await file.arrayBuffer()
                                            const base64Content = Buffer.from(arrayBuffer).toString('base64')
                                            
                                            field.onChange({
                                              filename: file.name,
                                              content: base64Content,
                                            })
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>

                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.0 }}
                            >
                              <FormField
                                control={form.control}
                                name="questionResponse"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                                      What interests you about working with our practice?
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        required
                                        className="text-[12px] leading-relaxed
                                                  text-white/85
                                                  placeholder:text-white/35 opacity-70 
                                                  w-full bg-transparent border border-white/20 rounded-lg 
                                                  px-4 py-3 focus:outline-none focus:border-white/60 
                                                  resize-none transition-colors"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>

                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.05 }}
                            >
                              <FormField
                                control={form.control}
                                name="additionalInfo"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                                      Is there anything else you'd like us to know?
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        className="text-[12px] leading-relaxed
                                                  text-white/85
                                                  placeholder:text-white/35 opacity-70  
                                                  w-full bg-transparent border border-white/20 rounded-lg 
                                                  px-4 py-3 focus:outline-none focus:border-white/60 
                                                  resize-none transition-colors"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>

                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.1 }}
                              className="pt-2 flex justify-end"
                            >
                              <button
                                type="submit"
                                disabled={status === "executing"}
                                className="up w-max text-[13px] uppercase tracking-widest
                                        border border-white/20 rounded-lg px-10 py-5
                                        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]]"
                              >
                                {status === "executing" ? "Submitting..." : "Submit"}
                              </button>
                            </motion.div>
                          </motion.div>
                        </form>
                      </Form>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
          )}
          </AnimatePresence>,
          document.getElementById("modal-root")
        )
      }
    </>
  )
}