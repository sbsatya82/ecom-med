import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-300 border-t border-gray-700'>
      <div className='container mx-auto px-4 py-8 flex flex-col lg:flex-row lg:justify-between gap-6'>

        {/* Left Section: Copyright, Address, Contact */}
        <div className='space-y-2 text-center lg:text-left'>
          <p className='text-sm'>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
          <p className='text-sm'><span className='font-semibold'>Store Address:</span> AT:- GUALSINGH, PO:- PANDIRI, DIST:- KENDRAPARA, PIN:- 754250</p>
          <p className='text-sm'><span className='font-semibold'>Contact:</span> +91 77359 32574</p>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className='flex justify-center lg:justify-end items-center gap-6 text-2xl'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='hover:text-blue-500 transition-colors'>
            <FaFacebook />
          </a>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='hover:text-pink-500 transition-colors'>
            <FaInstagram />
          </a>
          <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' className='hover:text-blue-400 transition-colors'>
            <FaLinkedin />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
