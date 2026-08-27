import { Logo } from '../common/Logo'

export function AuthHeader({ title, description }) {
  return (
    <div className="mb-9 text-center">
      <div className="mb-5 flex justify-center"><Logo compact /></div>
      <h1 className="font-display text-[30px] font-semibold tracking-tight text-[#c80008] dark:text-[#ef151d] sm:text-[34px]">{title}</h1>
      <p className="mx-auto mt-2 max-w-[460px] text-[14px] leading-relaxed text-[#6f5b5b] dark:text-[#d38f91]">{description}</p>
    </div>
  )
}
