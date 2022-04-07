import {useEffect, useState} from "react";
import Cookies from "universal-cookie/lib";
import useRequest from "../../hooks/useRequest";
import axios from "axios";

const cookies = new Cookies()
export default function useProfile(host) {
    const [profileData, setProfileData] = useState({})
    const [onProfile, setOnProfile] = useState(false)
    const [logged, setLogged] = useState(false)

    const refreshProfile = () => {
        const jwt = cookies.get('jwt')
        if (jwt) {
            axios({
                url: host + '/api/user/' + localStorage.getItem('email'),
                method: 'GET'
            }).then(res => {
                setLogged(!!res)
                setProfileData(res?.data)
            })
        }
    }
    useEffect(() => {
        refreshProfile()
    }, [])

    return {onProfile, setOnProfile, profileData, logged, setLogged, refreshProfile}
}