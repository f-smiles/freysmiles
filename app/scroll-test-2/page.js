import './css/style.css'
import Main from './components/main.jsx'

export default function Page() {
  return (
    <>
      <Spacer />
      <Main />
      <Spacer />
    </>
  )
}

const Spacer = () => {
  return <div className='w-[100dvw] h-[25dvh] bg-[#023020]'></div>
}