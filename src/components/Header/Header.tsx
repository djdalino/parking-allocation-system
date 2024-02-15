import Link from 'next/link';
import React from 'react'

const Header = () => {
  return (
    <>
    
    <header className='py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap'>
        <div className='flex items-center w-full md:2/3'>
            <Link href='/' className="font-black text-blue-500">
            COMPANY XYZ
            </Link>
            <ul className="flex items-center ml-5">
                <li className='flex items-center'>
                    <Link href='/'>
                        
                    </Link> 
                </li>
                {/* <li className="ml-2" >
                    {darkTheme ? (
                        <MdOutlineLightMode 
                            onClick={() => {
                                setDarkTheme(false);
                                localStorage.removeItem('hotel-theme')
                            }}
                        /> 
                    ) : ( 
                        <MdDarkMode className="cursor-pointer"
                            onClick={() => {
                                setDarkTheme(true);
                                localStorage.setItem('hotel-theme', "true")
                            }}
                        />
                    )}
                </li> */}
            </ul>
        </div>
    </header>
    </>
  )
}

export default Header