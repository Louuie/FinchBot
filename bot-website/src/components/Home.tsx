import * as React from 'react'
import { AuthButton } from './auth/AuthButton';
import { MUIMenu } from './mui/Menu';

export const Home: React.FC = () => {

  return (
   <div className='flex h-screen items-center justify-center'>
      <MUIMenu/>
      <AuthButton/>
   </div>
  )
}