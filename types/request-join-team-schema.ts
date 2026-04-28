import { z } from 'zod'

export const RequestJoinTeamSchema = z.object({
  name: z.string(),
  contactInfo: z.object({
    email: z.email({ pattern: z.regexes.email, error: "Enter valid email address" }),
    phone: z.string({ error: "Enter a valid 10 digit US phone number" }).length(10, { error: "Enter a valid 10 digit US phone number" }).regex(/^\+?[1-9]\d{1,14}$/),
  }),
  highSchoolGraduationYear: z.string().min(1, { error: "Please fill out this field." }),
  priorDentistryExperience: z.string().min(1, { error: "Please fill out this field." }),
  positionOfInterest: z.string().min(1, { error: "Please fill out this field." }),
  heardFrom: z.string().min(1, { error: "Please fill out this field." }),
  availabilityToStart: z.string().min(1, { error: "Message too short" }),
  availabilityLocations: z.string().min(1, { error: "Please fill out this field." }),  
  resume: z.object({
    filename: z.string().min(1, { error: "Please upload your resume. " }),
    content: z.instanceof(ArrayBuffer, { error: "Accepted formats: .pdf, .doc, .docx " }),
  }),
  questionResponse: z.string().max(300, { error: "Max 300 characters" }),
  additionalInfo: z.string().max(500, { error: "Max 500 characters" }),
})