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
      // value: z.e164({ message: "Enter a valid 10 digit US phone number" }),
    }),
  ]),
  highSchoolGraduationYear: z.coerce.number().int().min(1987).max(2027),
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

// contactInfo: z.union([
//   z.email(),
//   z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/).min(1, { message: "Invalid phone number" }),
// ]),
// contactInfo: z.union([
//   z.email(),
//   z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/),
//   // z.e164(),
// ]),
// contactInfo: 
//   z.email({ message: "Enter valid email address or 10 digit US phone number" })
//   .or(
//     z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: "Enter valid email or US phone number" })
//   ),
// contactInfo: z.union([
//   z.email({ pattern: z.regexes.email, message: "Enter valid email or 10 digit US phone number" }),
//   z.string().max(10, { message: "Enter valid email or 10 digit US phone number" }).regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
// ]),
// contactInfo: z.union([
//   z.email(),
//   z.string().regex(/^\+?[1-9]\d{1,14}$/),
// ]),