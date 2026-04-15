"use client"
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import z from 'zod'
import { useAction } from "next-safe-action/hooks"
import { toast } from 'sonner'

import JoinTeamForm from '@/components/forms/join-team-form'
import VerticalColorSpectrum from '@/components/vertical-color-spectrum'
import { CanvasBallsAnimation } from '@/components/canvas-balls-animation/index'
import { RequestJoinTeamSchema } from '@/types/request-join-team-schema'
import { requestJoinTeam } from '@/server/actions/request-join-team'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'


export default function Index() {
  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false)
  //   }, 2400)
  //   return () => clearTimeout(timer)
  // }, [])

  const [error, setError] = useState("")

  const [contactInfoSelect, setContactInfoSelect] = useState("email")

  const handleContactInfoSelectChange = (val) => {
    setContactInfoSelect(val)
    form.setValue("contactInfo", { type: val, value: "" })
    form.clearErrors("contactInfo")
  }

  const form = useForm<z.infer<typeof RequestJoinTeamSchema>>({
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

   const { execute, status } = useAction(requestJoinTeam, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error)
      if (data?.success) {
        form.reset()
        toast.success(data.success)
      }
    },
    onError(error) {
      console.error(error)
    }
  })

  const onSubmit = (values: z.infer<typeof RequestJoinTeamSchema>) => {
    // console.log(values)
    execute(values)
  }

  return (
    <>
      {/* {loading === true ? (
        <VerticalColorSpectrum />
      ) : <JoinTeamForm /> } */}
      
      <div
        className="w-full min-h-screen
                    px-12 md:px-20 py-14 md:py-20
                    bg-gradient-to-br from-[#4E5353] via-[#505456] to-[#3E4243]
                  "
      >
        
        <h2 className="text-[28px] text-white font-canela italic leading-snug mb-10">
          Start Your Application{" "}
          <span className="opacity-50 font-canela mx-2">—</span>
          <span className="text-[14px] tracking-wide opacity-70 align-middle font-neuehaas45 text-[#FEB44A]">
            Drop us your info and we'll reach out
          </span>
        </h2>

        <form
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
          id="join-our-team-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div id="left-column" className="space-y-6">
            <span className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-applicant-full-name"
                      className="text-[#FEB44A]/75"
                    >
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-applicant-full-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Jane Doe"
                      autoComplete="given-name"
                      required
                      className="border border-white/20
                                text-white/85 placeholder:text-white/35
                                  focus:outline-none focus:border-white/60
                                "
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="contactInfo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-applicant-preferred-contact-method"
                      className="text-[#FEB44A]/75"
                    >
                      Best way to reach you
                    </FieldLabel>
                    <span className="flex gap-3">
                      <select
                        id="form-applicant-preferred-contact-method"
                        // value={field.value.type}
                        // onChange={(val) => field.onChange({
                        //   type: val,
                        //   value: "",
                        // })}
                        value={contactInfoSelect}
                        onChange={handleContactInfoSelectChange}
                        required
                        className="h-9 px-3 py-1
                                    border border-white/20
                                    bg-transparent rounded-lg
                                    text-sm text-white/85 placeholder:text-white/35
                                    focus:outline-none focus:border-white/60
                                  "
                      >
                        <option value="email" className="text-primary">Email</option>
                        <option value="phone" className="text-primary">Phone</option>
                      </select>
                      {/* <Select
                        value={field.value.type}
                        onValueChange={(val) => field.onChange({
                          type: val,
                          value: "",
                        })}
                        required
                      >
                        <SelectTrigger
                          id="form-applicant-preferred-contact-method"
                          aria-invalid={fieldState.invalid}
                          className="w-max
                                     border border-white/20
                                   text-white/85 placeholder:text-white/35
                                     focus:outline-none focus:border-white/60
                                    "
                        >
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                        </SelectContent>
                      </Select> */}
                      <Input
                        value={field.value.value}
                        onChange={(e) => field.onChange({
                          type: contactInfoSelect,
                          value: e.target.value,
                        })}
                        // onChange={(e) => field.onChange({
                        //   ...field.value,
                        //   value: e.target.value,
                        // })}
                        type={field.value.type === "email" ? "email" : "tel"}
                        id="form-applicant-preferred-contact-method"
                        aria-invalid={fieldState.invalid}
                        placeholder={contactInfoSelect === "email" ? "Email address" : "Phone number"}
                        // placeholder={field.value.type === "email" ? "Email address" : "Phone number"}
                        autoComplete="email"
                        required
                        className="border border-white/20
                                  text-white/85 placeholder:text-white/35
                                    focus:outline-none focus:border-white/60
                                  "
                      />
                    </span>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </span>

            <span className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Controller
                name="highSchoolGraduationYear"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel 
                      htmlFor="form-applicant-graduation-year"
                      className="text-[#FEB44A]/75"
                    >
                      High School Graduation Year
                    </FieldLabel>
                    <select
                      id="form-applicant-graduation-year"
                      value={field.value}
                      onChange={field.onChange}
                      required
                      className="h-9 px-3 py-1
                                  border border-white/20
                                  bg-transparent rounded-lg
                                  text-sm text-white/85 placeholder:text-white/35
                                  focus:outline-none focus:border-white/60
                                "
                    >
                      <option value="" disabled>Select year</option>

                      {Array.from({ length: 41 }, (_, i) => {
                        const year = new Date().getFullYear() - i
                        return  <option key={year} value={year.toString()} className="text-primary">{year}</option>
                      })}
                    </select>
                    {/* <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger
                        id="form-applicant-graduation-year"
                        aria-invalid={fieldState.invalid}
                        className="border border-white/20
                                 text-white/85 placeholder:text-white/35
                                   focus:outline-none focus:border-white/60
                                  "
                      >
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {Array.from({ length: 41 }, (_, i) => {
                          const year = new Date().getFullYear() - i
                          return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        })}
                      </SelectContent>
                    </Select> */}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="priorDentistryExperience"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-applicant-prior-experience-in-dentistry"
                      className="text-[#FEB44A]/75"
                    >
                      Do you have experience working in dentistry or orthodontics?
                    </FieldLabel>
                    <select
                      id="form-applicant-prior-experience-in-dentistry"
                      value={field.value}
                      onChange={field.onChange}
                      required
                      className="h-9 px-3 py-1
                                  border border-white/20
                                  bg-transparent rounded-lg
                                  text-sm text-white/85 placeholder:text-white/35
                                  focus:outline-none focus:border-white/60
                                "
                    >
                      <option value="" disabled>Select yes or no</option>
                      <option value="yes" className="text-primary">Yes</option>
                      <option value="no" className="text-primary">No</option>
                    </select>
                    {/* <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger
                        id="form-applicant-prior-experience-in-dentistry"
                        aria-invalid={fieldState.invalid}
                        className="border border-white/20
                                 text-white/85 placeholder:text-white/35
                                   focus:outline-none focus:border-white/60
                                  "
                      >
                        <SelectValue placeholder="Select yes or no" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select> */}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </span>

            <span className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Controller
                name="positionOfInterest"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel 
                      htmlFor="form-applicant-position-of-interest"
                      className="text-[#FEB44A]/75"
                    >
                      Position you're interested in
                    </FieldLabel>
                    <select
                      id="form-applicant-position-of-interest"
                      value={field.value}
                      onChange={field.onChange}
                      required
                      className="h-9 px-3 py-1
                                  border border-white/20
                                  bg-transparent rounded-lg
                                  text-sm text-white/85 placeholder:text-white/35
                                  focus:outline-none focus:border-white/60
                                "
                    >
                      <option value="" disabled>Select role</option>
                      <option value="assistant" className="text-primary">Clinical Assistant</option>
                      <option value="front-desk" className="text-primary">Front Desk / Admin</option>
                      <option value="coordinator" className="text-primary">Patient Coordinator</option>
                      <option value="sterilization" className="text-primary">Sterilization / Lab</option>
                      <option value="open" className="text-primary">Open / Unsure</option>
                    </select>
                    {/* <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger
                        id="form-applicant-position-of-interest"
                        aria-invalid={fieldState.invalid}
                        className="border border-white/20
                                 text-white/85 placeholder:text-white/35
                                   focus:outline-none focus:border-white/60
                                  "
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value="assistant">Clinical Assistant</SelectItem>
                        <SelectItem value="front-desk">Front Desk / Admin</SelectItem>
                        <SelectItem value="coordinator">Patient Coordinator</SelectItem>
                        <SelectItem value="sterilization">Sterilization / Lab</SelectItem>
                        <SelectItem value="open">Open / Unsure</SelectItem>
                      </SelectContent>
                    </Select> */}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              
              <Controller
                name="heardFrom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-applicant-how-did-you-hear-about-us"
                      className="text-[#FEB44A]/75"
                    >
                      How did you hear about us?
                    </FieldLabel>
                    <select
                      id="form-applicant-how-did-you-hear-about-us"
                      value={field.value}
                      onChange={field.onChange}
                      required
                      className="h-9 px-3 py-1
                                  border border-white/20
                                  bg-transparent rounded-lg
                                  text-sm text-white/85 placeholder:text-white/35
                                  focus:outline-none focus:border-white/60
                                "
                    >
                      <option value="" disabled>Select one</option>
                      <option value="website" className="text-primary">Website</option>
                      <option value="social" className="text-primary">Social Media</option>
                      <option value="friend-employee" className="text-primary">Friend / Employee</option>
                      <option value="other" className="text-primary">Other</option>
                    </select>
                    {/* <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger
                        id="form-applicant-how-did-you-hear-about-us"
                        aria-invalid={fieldState.invalid}
                        className="border border-white/20
                                 text-white/85 placeholder:text-white/35
                                   focus:outline-none focus:border-white/60
                                  "
                      >
                        <SelectValue placeholder="Select one" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="friend-employee">Friend / Employee</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select> */}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </span>

            <span className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Controller
                name="availabilityToStart"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel 
                      htmlFor="form-applicant-available-to-start-when"
                      className="text-[#FEB44A]/75"
                    >
                      When would you be available to start?
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-applicant-available-to-start-when"
                      aria-invalid={fieldState.invalid}
                      placeholder="Immediately, in 2 weeks, next month, etc..."
                      required
                      className="border border-white/20
                                text-white/85 placeholder:text-white/35
                                  focus:outline-none focus:border-white/60
                                "
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="availabilityLocations"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-applicant-available-to-work-all-four-locations-allentown-bethlehem-lehighton-schnecksville"
                      className="text-[#FEB44A]/75"
                    >
                      {`Would you be available to work all 4 of our locations? (Allentown, Bethlehem, Lehighton, Schnecksville)`}
                    </FieldLabel>
                    <select
                      id="form-applicant-available-to-work-all-four-locations-allentown-bethlehem-lehighton-schnecksville"
                      value={field.value}
                      onChange={field.onChange}
                      required
                      className="h-9 px-3 py-1
                                    border border-white/20
                                    bg-transparent rounded-lg
                                    text-sm text-white/85 placeholder:text-white/35
                                    focus:outline-none focus:border-white/60
                                  "
                    >
                      <option value="" disabled>Select yes or no</option>
                      <option value="yes" className="text-primary">Yes</option>
                      <option value="no" className="text-primary">No</option>
                    </select>
                    {/* <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger
                        id="form-applicant-available-to-work-all-four-locations-allentown-bethlehem-lehighton-schnecksville"
                        aria-invalid={fieldState.invalid}
                        className="border border-white/20
                                 text-white/85 placeholder:text-white/35
                                   focus:outline-none focus:border-white/60
                                  "
                      >
                        <SelectValue placeholder="Select yes or no" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select> */}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </span>
          </div>

          <div id="right-column" className="space-y-6">
            <Controller
              name="resume"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-applicant-resume-pdf-preferred-accept-doc-docx"
                    className="text-[#FEB44A]/75"
                  >
                    {`Resume (PDF Prefered)`}
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
                    id="form-applicant-resume-pdf-preferred-accept-doc-docx"
                    className="border border-white/20
                              text-white/85 file:text-[#FEB44A]/75
                                focus:outline-none focus:border-white/60
                              "
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
    
            <Controller
              name="questionResponse"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-applicant-what-interests-you-about-working-with-our-practice"
                    className="text-[#FEB44A]/75"
                  >
                    What interests you about working with our practice?
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-applicant-what-interests-you-about-working-with-our-practice"
                    aria-invalid={fieldState.invalid}
                    required
                    className="border border-white/20
                              text-white/85 placeholder:text-white/35
                              "
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            
            <Controller
              name="additionalInfo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-applicant-additional-information"
                    className="text-[#FEB44A]/75"
                  >
                    Is there anything else you'd like us to know?
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-applicant-additional-information"
                    aria-invalid={fieldState.invalid}
                    className="border border-white/20
                              text-white/85 placeholder:text-white/35
                              "
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <button
              type="submit"
              disabled={status === "executing"}
              className="up w-max rounded-lg
                          float-right
                          px-10 py-5
                          text-[13px] uppercase tracking-widest
                          border border-white/20
                          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]]
                        "
            >
              <span>
                {status === "executing" ? "Submitting..." : "Submit"}
              </span>
            </button>
          </div>

        </form>
      </div>
    </>
  )
}