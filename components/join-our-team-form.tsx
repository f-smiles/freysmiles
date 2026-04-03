"use client"
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import { MoveRightIcon } from "lucide-react";

import { RequestJoinTeamSchema } from "@/types/request-join-team-schema";
import { requestJoinTeam } from "@/server/actions/request-join-team";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


export function JoinOurTeamForm() {
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
        <div className="flex flex-row items-end gap-3">
          <span className="font-neuehaas45 tracking-wide">Join Our Team</span>
          <span className="font-canela italic tracking-wide flex items-center gap-3">
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