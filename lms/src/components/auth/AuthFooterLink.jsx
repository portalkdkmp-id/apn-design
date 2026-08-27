export function AuthFooterLink({ prompt, href, children }) {
  return <p className="mt-8 text-center text-[14px] text-[#24191a] dark:text-[#f0dddd]">{prompt}{' '}<a href={href} className="font-medium text-[#a90008] hover:text-[#d00009] dark:text-[#ef151d]">{children}</a></p>
}
