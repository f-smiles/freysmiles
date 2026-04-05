import { z } from 'zod'

export const RequestJoinTeamSchema = z.object({
  name: z.string(),
  contactInfo: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("email"),
      value: z.email({ pattern: z.regexes.email, message: "Enter valid email address" }),
    }),
    z.object({
      type: z.literal("phone"),
      value: z.string({ message: "Enter a valid 10 digit US phone number" }).length(10).regex(/^\+?[1-9]\d{1,14}$/),
    }),
  ]),
  highSchoolGraduationYear: z.string(),
  priorDentistryExperience: z.string(),
  positionOfInterest: z.string(),
  heardFrom: z.string(),
  availabilityToStart: z.string().min(1, { message: "Message too short" }),
  availabilityLocations: z.string(),  
  resume: z.object({
    filename: z.string().min(1, { message: "Please upload your resume. " }),
    content: z.any().nonoptional({ message: "Accepted formats: .pdf, .doc, .docx " }),
  }),
  questionResponse: z.string().max(300, { message: "Max 300 characters" }),
  additionalInfo: z.string().max(500, { message: "Max 500 characters" }),
})