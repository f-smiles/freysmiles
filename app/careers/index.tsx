"use client"
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react";
import { Controller, Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RequestJoinTeamSchema } from '@/types/request-join-team-schema';
import { useAction } from 'next-safe-action/hooks';
import { requestJoinTeam } from '@/server/actions/request-join-team';
import { toast } from 'sonner';

import { CanvasBallsAnimation } from '@/components/book-now/canvas-balls-animation';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';


export default function Index() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("")
  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);
  
  // const handleClose = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setOpen(false);
  // };

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

  // useEffect(() => {
  //   console.log(contactInfoSelect)
  // }, [contactInfoSelect])

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
    // console.log(values)
    execute(values)
  }

  return (
    <div className="relative w-full h-screen
                    bg-gradient-to-br from-[#4E5353] via-[#505456] to-[#3E4243]
                    flex items-start justify-center
                    overflow-y-auto overflow-x-hidden"
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
        <div className="w-full px-12 md:px-20 pt-14 md:pt-20 mb-8">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[28px] text-white font-canela italic mb-10"
          >
            Start Your Application{" "}
            <span className="opacity-50 font-canela mx-2">—</span>
            <span className="text-[14px] tracking-wide opacity-70 align-middle font-neuehaas45 text-[#FEB44A]">
              Drop us your info and we'll reach out
            </span>
          </motion.h2>
              
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-2 gap-x-20 gap-y-8\">
            {/* LEFT COLUMN */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-full-name"
                        >
                          Full Name
                        </FieldLabel>
                        <Input
                          className="text-[12px] leading-relaxed text-white/85 placeholder:text-white/35
                                      opacity-70 bg-transparent transition-colors
                                      w-full rounded-lg px-4 py-3 resize-none
                                      border border-white/20 focus:outline-none focus:border-white/60"
                          {...field}
                          id="form-applicant-full-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="Jane Doe"
                          required
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </motion.span>
                
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.65 }}
                >
                  <FieldGroup>
                    <Controller
                      name="contactInfo"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                            htmlFor="form-applicant-contact-method"
                          >
                            Best way to reach you
                          </FieldLabel>
                          <div className="flex items-center gap-2">
                            <Select
                              defaultValue="email"
                              value={contactInfoSelect}
                              onValueChange={handleContactInfoSelectChange}
                            >
                              <SelectTrigger
                                className="w-max text-xs text-white border border-white/20 data-[placeholder]:text-white/85"
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
                              type={contactInfoSelect === "email" ? "email" : "tel"}
                              value={field.value.value}
                              onChange={(e) => field.onChange({
                                type: contactInfoSelect,
                                value: e.target.value,
                              })}
                              placeholder={contactInfoSelect === "email" ? "Email address" : "Phone number"}
                              className="text-[12px] leading-relaxed text-white/85 placeholder:text-white/35
                                          opacity-70 bg-transparent transition-colors
                                          w-full rounded-lg px-4 py-3 resize-none
                                          border border-white/20 focus:outline-none focus:border-white/60"
                              id="form-applicant-contact-method"
                              aria-invalid={fieldState.invalid}
                              required
                            />
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </motion.span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Controller
                    name="highSchoolGraduationYear"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel 
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-high-school-graduation-year"
                        >
                          High School Graduation Year
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          required
                        >
                          <SelectTrigger
                            className="border border-white/20 text-white data-[placeholder]:text-white/85"
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
                      </Field>
                    )}
                  />
                </motion.span>

                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
                >
                  <Controller
                    name="priorDentistryExperience"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field aria-invalid={fieldState.invalid}>
                        <FieldLabel 
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-prior-experience-in-dentistry"
                        >
                          Do you have experience working in dentistry or orthodontics?
                        </FieldLabel>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          value={field.value}
                          required
                        >
                          <SelectTrigger
                            className="border border-white/20 text-white data-[placeholder]:text-white/85"
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
                      </Field>
                    )}
                  />
                </motion.span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Controller
                    name="positionOfInterest"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field aria-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-position-of-interest"
                        >
                          Position you're interested in
                        </FieldLabel>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          value={field.value}
                          required
                        >
                          <SelectTrigger
                            className="border border-white/20 text-white data-[placeholder]:text-white/85"
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
                      </Field>
                    )}
                  />
                </motion.span>

                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.85 }}
                >
                  <Controller
                    name="heardFrom"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field aria-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-how-did-you-hear-about-us"
                        >
                          How did you hear about us?
                        </FieldLabel>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          value={field.value}
                          required
                        >
                          <SelectTrigger
                            className="border border-white/20 text-white data-[placeholder]:text-white/85"
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
                      </Field>
                    )}
                  />
                </motion.span>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <Controller
                    name="availabilityToStart"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field aria-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-availability-to-start"
                        >
                          When would you be available to start?
                        </FieldLabel>
                        <Input
                          {...field}
                          className="text-[12px] leading-relaxed text-white/85 placeholder:text-white/35
                                      opacity-70 bg-transparent transition-colors
                                      w-full rounded-lg px-4 py-3 resize-none
                                      border border-white/20 focus:outline-none focus:border-white/60"
                          id="form-applicant-availability-to-start"
                          placeholder="Immediately, in 2 weeks, next month, etc..."
                          required
                        />
                      </Field>
                    )}
                  />
                </motion.span>

                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.95 }}
                >
                  <Controller
                    name="availabilityLocations"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field aria-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                          htmlFor="form-applicant-available-to-work-all-4-locations-allentown-bethlehem-lehighton-schnecksville"
                        >
                          {`Would you be available to work all 4 of our locations? (Allentown, Bethlehem, Lehighton, Schnecksville)`}
                        </FieldLabel>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          value={field.value}
                          required
                        >
                          <SelectTrigger
                            className="border border-white/20 text-white data-[placeholder]:text-white/85"
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
                      </Field>
                    )}
                  />
                </motion.span>
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
                <Controller
                  name="resume"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                        htmlFor="form-applicant-resume-pdf-preferred-accept-doc-docx"
                      >
                        {`Resume (PDF Preferred)`}
                      </FieldLabel>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
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
                        className="text-[12px] leading-relaxed text-white/85 placeholder:text-white/35 file:text-[#FEB44A]
                                    opacity-70 bg-transparent transition-colors
                                    w-full rounded-lg resize-none
                                    border border-white/20 focus:outline-none focus:border-white/60"
                        id="form-applicant-resume-pdf-preferred-accept-doc-docx"
                        required
                      />
                    </Field>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <Controller
                  name="questionResponse"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                        htmlFor="form-applicant-question"
                      >
                        What interests you about working with our practice?
                      </FieldLabel>
                      <Textarea
                        className="text-[12px] leading-relaxed text-white/85 placeholder:text-white/35
                                    opacity-70 bg-transparent transition-colors
                                    w-full rounded-lg px-4 py-3 resize-none
                                    border border-white/20 focus:outline-none focus:border-white/60"
                        {...field}
                        required
                      />
                    </Field>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.05 }}
              >
                <Controller
                  name="additionalInfo"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]"
                        htmlFor="form-applicant-additional-information"
                      >
                        Is there anything else you'd like us to know?
                      </FieldLabel>
                      <Textarea
                        className="text-[12px] leading-relaxed text-white/85 placeholder:text-white/35
                                    opacity-70 bg-transparent transition-colors
                                    w-full rounded-lg px-4 py-3 resize-none
                                    border border-white/20 focus:outline-none focus:border-white/60"
                        {...field}
                        required
                      />
                    </Field>
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
                  className="up w-max text-[13px] uppercase tracking-widest border border-white/20 rounded-lg px-10 py-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]]"
                >
                  {status === "executing" ? "Submitting..." : "Submit"}
                </button>
              </motion.div>
            </motion.div>
          </form>

        </div>
      </motion.div>
    </div>
  )
}
