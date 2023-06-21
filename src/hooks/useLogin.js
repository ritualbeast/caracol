import { useContext } from "react";
import { CrearContext } from "../services/Loginservices";

const useLogin = () => {
    return useContext(CrearContext);
    }

export default useLogin;