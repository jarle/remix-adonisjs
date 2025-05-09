import { unstable_createContext } from 'react-router'
import { AdonisApplicationContext } from './remix_adapter.js'

export const adonisContext = unstable_createContext<AdonisApplicationContext>()
