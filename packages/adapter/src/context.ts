import { createContext } from "react-router";
import { AdonisApplicationContext } from "./react_router_adapter.js";

export const adonisContext = createContext<AdonisApplicationContext>()
