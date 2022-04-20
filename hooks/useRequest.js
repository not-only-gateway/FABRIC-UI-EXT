import axios from "axios";
import {useContext, useState} from "react";
import {AlertProvider} from "@f-ui/core";
import Cookies from "universal-cookie/lib";


const cookies = new Cookies()
export default function useRequest(sS = true) {
    const alert = useContext(AlertProvider)
    const [showSuccess, setShowSuccess] = useState(sS)

    const make = async (params, overrideShowSuccess, showError=true) => {
        let res
    const auth = {authorization: params.headers?.authorization ? params.headers?.authorization : cookies.get('jwt')}
        try {
            res = await axios({...params,
            headers: params.headers ? {...params.headers, ...auth} : auth
            })

            if (showSuccess||overrideShowSuccess) alert.pushAlert('Sucesso', 'success')
        } catch (e) {
            if(showError)
                alert.pushAlert('Algum erro ocorreu', 'error')
        }

        return res
    }

    return {
        setShowSuccess,
        showSuccess,
        make
    }
}