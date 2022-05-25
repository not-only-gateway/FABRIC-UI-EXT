import {useEffect, useState} from "react";
import Cookies from "universal-cookie/lib";
import axios from "axios";

const cookies = new Cookies()
export default function useProfile(host) {
    const [profileData, setProfileData] = useState({})
    const [onProfile, setOnProfile] = useState(false)
    const [logged, setLogged] = useState(false)

    const refreshProfile = () => {
        const jwt = cookies.get('jwt')
        if (jwt) {
           try{
               axios({
                   url: host + '/api/user/' + localStorage.getItem('email'),
                   method: 'GET'
               }).then(res => {
                   setLogged(!!res)
                   setProfileData(res?.data)
               }).catch(error => {
               });
           }catch (e){}
        }
    }
    useEffect(() => {
        refreshProfile()
    }, [])

    return {onProfile, setOnProfile, profileData,setProfileData, logged, setLogged, refreshProfile}
}