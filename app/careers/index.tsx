"use client"
import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { motion } from "motion/react"

import { requestJoinTeam } from "@/server/actions/request-join-team"
import { RequestJoinTeamSchema } from "@/types/request-join-team-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CanvasBallsAnimation } from "@/components/canvas-balls-animation"


export default function Index() {
  const [error, setError] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    resolver: zodResolver(RequestJoinTeamSchema),
    defaultValues: {
      name: "",
      contactInfo: {
        email: "",
        phone: "",
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

  const { execute, status } = useAction(requestJoinTeam, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error)
      if (data?.success) {
        form.reset()
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        toast.success(data.success)
      }
    },
    onError(error) {
      console.error(error)
    }
  })

  const onSubmit = (values) => {
    // console.log(values)
    execute(values)
  }

  return (
    <div 
      className="relative min-h-screen h-full
                  bg-gradient-to-br from-[#4E5353] via-[#505456] to-[#3E4243]
                text-white
                "
    >
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <CanvasBallsAnimation />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-noise z-[2]" />

      <div className="w-full px-12 md:px-20 pt-14 md:pt-20 pb-14 z-[3]">
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[28px] font-canela italic mb-10"
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
              <div className="grid grid-cols-1">
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
                        <FormLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-full-name"
                        >
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            placeholder="Jane Doe"
                            id="form-applicant-full-name"
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
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <FormField
                    control={form.control}
                    name="contactInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-contact-information-email-address"
                        >
                          Email address
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            placeholder="example@email.com"
                            type="email"
                            id="form-applicant-contact-information-email-address"                        
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
                  transition={{ delay: 0.7 }}
                >
                  <FormField
                    control={form.control}
                    name="contactInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-contact-information-phone-number"
                        >
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            placeholder="5556667777"
                            type="tel"
                            id="form-applicant-contact-information-phone-number"
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
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
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
                            value={field.value}
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
                                {Array.from({ length: 80 }, (_, i) => {
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
                  transition={{ delay: 0.8 }}
                >
                  <FormField
                    control={form.control}
                    name="priorDentistryExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-do-you-have-prior-experience-working-in-dentistry"
                        >
                          Do you have experience working in dentistry or orthodontics?
                        </FormLabel>
                        <FormControl>
                          <Select
                            required
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className="border border-white/20 data-[placeholder]:text-white/85"
                              id="form-applicant-do-you-have-prior-experience-working-in-dentistry"
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
                  transition={{ delay: 0.85 }}
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
                  transition={{ delay: 0.9 }}
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
                  transition={{ delay: 0.95 }}
                >
                  <FormField
                    control={form.control}
                    name="availabilityToStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-when-would-you-be-available-to-start"
                        >
                          When would you be available to start?
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            placeholder="Immediately, in 2 weeks, next month, etc..."
                            id="form-applicant-when-would-you-be-available-to-start"
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
                          htmlFor="form-applicant-would-you-be-available-to-work-all-4-locations-allentown-bethlehem-lehighton-schnecksville"
                        >
                          {`Would you be available to work all 4 of our locations? (Allentown, Bethlehem, Lehighton, Schnecksville)`}
                        </FormLabel>
                        <FormControl>
                          <Select
                            required
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger 
                              className="border border-white/20 data-[placeholder]:text-white/85"
                              id="form-applicant-would-you-be-available-to-work-all-4-locations-allentown-bethlehem-lehighton-schnecksville"
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
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          required
                          id="form-applicant-resume-pdf-preferred-accept-doc-docx"
                          className="text-[12px] leading-relaxed
                                    opacity-70 file:text-white/85
                                  text-white/85 placeholder:text-white/35 file:text-[#FEB44A]
                                    border border-white/30 hover:border-white
                                    cursor-pointer transition-colors"
                          onChange={async (e) => {
                            let file = e.target.files[0]
                            field.onChange({
                              filename: file.name,
                              content: await file.arrayBuffer(),
                            })
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
                      <FormLabel
                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                        htmlFor="form-applicant-what-interests-you-about-working-with-us"
                      >
                        What interests you about working with our practice?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          required
                          id="form-applicant-what-interests-you-about-working-with-us"
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
                      <FormLabel
                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                        htmlFor="form-applicant-do-you-have-additional-information-you-would-like-us-to-know"
                      >
                        Is there anything else you'd like us to know?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          id="form-applicant-do-you-have-additional-information-you-would-like-us-to-know"
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
    </div>
  )
}