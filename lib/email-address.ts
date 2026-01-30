export default function getEmailAddress() {
  if (process.env.NODE_ENV === "production") return process.env.FS_EMAIL
  return process.env.TEST_FS_EMAIL
}