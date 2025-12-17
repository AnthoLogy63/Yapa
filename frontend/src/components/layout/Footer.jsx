import YapaLogo from '../../assets/logo.png';

function Footer() {
  return (
    <div className="w-full bg-[#F99F3F] pt-6 mt-16 flex flex-col items-center">
      <div className="flex items-center justify-center p-12">
        <img
          src={YapaLogo}
          alt="Logo Yapa"
          className="
            w-44 h-auto
            drop-shadow-[2px_0_0_white]
            drop-shadow-[-2px_0_0_white]
            drop-shadow-[0_2px_0_white]
            drop-shadow-[0_-2px_0_white]
          "
        />
      </div>
    </div>
  );
}

export default Footer;
