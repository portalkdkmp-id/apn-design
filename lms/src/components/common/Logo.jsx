import logo from '../../assets/logokdkmp.png'

export function Logo({ compact = false, light = false }) {
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-2.5'}`}>
      <img
        src={logo}
        alt="Logo Koperasi Desa Kelurahan Merah Putih"
        className={compact ? 'h-9 w-auto object-contain' : 'h-10 w-auto object-contain'}
      />
      {!compact && (
        <div className={`font-display text-[14px] font-bold leading-tight ${light ? 'text-white' : 'text-[#201415] dark:text-[#f7f2ee]'}`}>
          Learning Management System
          <small className={`mt-0.5 block font-body text-[10px] font-normal ${light ? 'text-white/80' : 'text-[#746563] dark:text-[#b8abaa]'}`}>
            Koperasi Desa Kelurahan Merah Putih
          </small>
        </div>
      )}
    </div>
  )
}
