"use server"
import { Resend } from "resend"
import { pretty, render } from "@react-email/render"
import ApplicationTemplate from "@/components/email-templates/application"
import { config } from "dotenv"

config({ path: ".env.local" })
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendApplication(
  formData: any,
){
  const { name, resume } = formData
  
  const { data, error } = await resend.emails.send({
    from: process.env.NODE_ENV === "production" ? process.env.FS_EMAIL : "onboarding@resend.dev",
    to: process.env.NODE_ENV === "production" ? process.env.FS_EMAIL : process.env.TEST_FS_EMAIL,
    subject: `${name} submitted an application to join FreySmiles`,
    html: await pretty(await render(<ApplicationTemplate {...formData} />)),
    attachments: [
      {
        filename: resume.filename,
        content: Buffer.from(resume.content).toString("base64"),
      }
    ],
  })

  if (error) return error
  if (data) return data
}