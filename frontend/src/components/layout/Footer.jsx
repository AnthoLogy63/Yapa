import YapaLogo from '../../assets/logo.png';

function Footer() {
  return (
    <div className="w-full bg-white pt-4 mt-5 flex flex-col items-center">
      
      <div className="w-[40vw] h-1 bg-[#F99F3F]"></div>

      <div className="flex flex-col items-center justify-center p-8">
        <img 
          src={YapaLogo} 
          alt="Logo Yapa" 
          className="w-45 h-auto" 
        />
      </div>
      
    </div>
  );
}

export default Footer;