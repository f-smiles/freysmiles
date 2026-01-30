'use server'

import { actionClient } from "@/lib/safe-action"
import { RequestJoinTeamSchema } from "@/types/request-join-team-schema"
import { sendApplication } from "./email-send"

export const requestJoinTeam = actionClient
  .schema(RequestJoinTeamSchema)
  .action(async ({ parsedInput: {
    name,
    contactInfo,
    highSchoolGraduationYear,
    priorDentistryExperience,
    positionOfInterest,
    heardFrom,
    availabilityToStart,
    availabilityLocations,
    resume,
    questionResponse,
    additionalInfo,
  }}) => {

    try {
      await sendApplication({
        name,
        contactInfo,
        highSchoolGraduationYear,
        priorDentistryExperience,
        positionOfInterest,
        heardFrom,
        availabilityToStart,
        availabilityLocations,
        resume,
        questionResponse,
        additionalInfo,
      })
    
      return { success: `Thank you for your interest in joining FreySmiles! Your application was received. Our team will get back to you as soon as possible.` }
    }
    catch (error) {
      return { error: "There was a problem submitting your form. Please try again." }
    }
  })
  
  // return { success: `Thank you for your interest in joining FreySmiles! Your application was received${contactInfo.includes("@") ? " and a confirmation email has been sent to your inbox" : ""}. Our team will get back to you as soon as possible.` }