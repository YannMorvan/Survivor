"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareMore, UserRound, Menu } from 'lucide-react';
import Chat from './chat';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pathname, setPathname] = useState('');
  const [triggerChat, setTriggerChat] = useState(false);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const buttonRef: React.MutableRefObject<null> = useRef(null);

  const toggleDropdown: () => void = () => {
    const button = buttonRef.current;

    if (button) {
      const isButtonHidden = window.getComputedStyle(button).display === 'none';

      if (!isButtonHidden) {
        setIsDropdownOpen(!isDropdownOpen);
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getActiveRoute = (route: string) => {
    return pathname === route.toLowerCase() ? 'text-sky-700' : 'md:text-slate-700';
  };

  return (
    <div className='mb-10'>
      <nav className="bg-white border-b border-gray-300 dark:bg-gray-900">
        <div className="max-w-screen p-4 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Soul Connection</span>
          </a>
          <div className="flex items-center justify-end md:order-2 space-x-10 md:space-x-0 rtl:space-x-reverse">
            <div className='lg:block hidden mr-5'>
              <MessageSquareMore onClick={() => setTriggerChat(!triggerChat)} className='text-sky-700 cursor-pointer mt-0.5 mr-3'/>
            </div>
            {triggerChat
              ? <Chat />
            : null}
            <div className='lg:block pr-6 hidden'>
              <svg className="w-6 h-6" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><circle cx="256" cy="256" fill="#f0f0f0" r="256"/><path d="m512 256c0-110.071-69.472-203.906-166.957-240.077v480.155c97.485-36.172 166.957-130.007 166.957-240.078z" fill="#d80027"/><path d="m0 256c0 110.071 69.473 203.906 166.957 240.077v-480.154c-97.484 36.171-166.957 130.006-166.957 240.077z" fill="#0052b4"/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>
            </div>
            <div className='border cursor-pointer rounded-full p-2 bg-sky-600 lg:block hidden'>
              <UserRound size={16} color='white'/>
            </div>
            <div className="relative inline-block text-left">
              <button
                id="Main Menu"
                aria-label="Main Menu"
                type="button"
                onClick={toggleDropdown}
                ref={buttonRef}
                className="lg:hidden block text-black border border-slate-300 bg-white hover:bg-slate-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-white"
              >
                <Menu />
              </button>
              <div
                id="dropdown"
                className={`z-10 ${isDropdownOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute right-0 mt-2`}
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                  <li>
                    <a href="/dashboard" className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${getActiveRoute('/dashboard')}`}>Tableau</a>
                  </li>
                  <li>
                    <a href="/coaches" className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${getActiveRoute('/coaches')}`}>Coachs</a>
                  </li>
                  <li>
                    <a href="/customers" className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${getActiveRoute('/customers')}`}>Clients</a>
                  </li>
                  <li>
                    <a href="/tips" className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${getActiveRoute('/tips')}`}>Conseils</a>
                  </li>
                  <li>
                    <a href="/events" className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${getActiveRoute('/events')}`}>Evènements</a>
                  </li>
                  <li>
                    <a href="/clothes" className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${getActiveRoute('/clothes')}`}>Vetements</a>
                  </li>
                  <li>
                    <a href="/astro" className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${getActiveRoute('/astro')}`}>Compatibilité</a>
                  </li>
                  <li>
                    <a href="/statistics" className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${getActiveRoute('/stats')}`}>Statistiques</a>
                  </li>
                  <div className='border'></div>
                  <li>
                    <div className='flex hover:bg-gray-100'>
                      <MessageSquareMore className='text-sky-700 cursor-pointer mt-1.5 ml-3'/>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Chat</a>
                    </div>
                  </li>
                  <li>
                    <div className='flex hover:bg-gray-100'>
                      <div className='border cursor-pointer rounded-full p-2 ml-2 bg-sky-600'>
                        <UserRound size={12} color='white'/>
                      </div>
                      <a href="#" className="block py-1 pl-3.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={`w-full lg:flex lg:w-auto ${isMenuOpen ? 'block' : 'hidden'}`}>
  <ul className="font-medium md:static absolute flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 dark:border-gray-700">
    {[
      { label: 'Tableau', path: 'dashboard' },
      { label: 'Coachs', path: 'coaches' },
      { label: 'Clients', path: 'customers' },
      { label: 'Conseils', path: 'tips' },
      { label: 'Evènement', path: 'events' },
      { label: 'Vêtements', path: 'clothes' },
      { label: 'Compatibilité', path: 'astro' },
      { label: 'Stats', path: 'statistics' },
    ].map((route) => (
      <li className="relative inline-block" key={route.path}>
        <a
          href={`/${route.path}`}
          className={`block py-2 px-3 ${
            pathname.startsWith(`/${route.path}`) ? 'text-sky-700' : 'md:text-slate-700'
          } bg-blue-700 text-sm rounded md:bg-transparent md:p-0 md:dark:dark-blue-500 inline-block relative`}
        >
          {route.label}
          {pathname.startsWith(`/${route.path}`) && (
            <div className="absolute mt-5 w-full border-t-4 p-0.5 rounded-xl border-sky-600"></div>
          )}
        </a>
      </li>
    ))}
  </ul>
</div>


        </div>
      </nav>
    </div>
  );
};

export default Navbar;
