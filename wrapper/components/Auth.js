import PropTypes from "prop-types";
import styles from '../styles/Auth.module.css'
import {Button, TextField} from "@f-ui/core";
import {useState} from "react";
import useRequest from "../../hooks/useRequest";
import Cookies from "universal-cookie/lib";

const cookies = new Cookies()
export default function Auth(props) {
    const [form, setForm] = useState({email: '', password: ''})
    const {make} = useRequest(true)
    const [error, setError] = useState(false)
    const submit = async () => {
        try {
            const res = await make({
                url: props.host + '/api/authentication',
                method: 'POST',
                data: {...form, email: form.email + '@aeb.gov.br'}
            })
            console.log(res)
            if (res?.status === 202) {
                cookies.set('jwt', res.data.jwt)
                localStorage.setItem('exp', res.data.exp)
                localStorage.setItem('email', form.email + '@aeb.gov.br')
                props.handleClose()
            } else
                setError(true)
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.inputs}>
                <img className={styles.logo} src={'/' + props.theme + '.png'} alt={'SIS-AEB'}/>
                <TextField
                    label={'Email'}
                    placeholder={'Email'}
                    maskEnd={'@aeb.gov.br'}
                    handleChange={(v) => setForm({...form, email: v.target.value})} value={form.email}
                    width={'100%'}
                />
                <TextField
                    label={'Senha'}
                    placeholder={'Senha'}
                    handleChange={(v) => {
                        if (error)
                            setError(false)
                        setForm({...form, password: v.target.value})
                    }} value={form.password}
                    width={'100%'} type={'password'}
                    helperText={error ? 'Senha ou email não compatíveis' : undefined}
                    onEnter={() => {
                        console.log(form.password.length >= 8 && form.email.length > 0)
                        if (form.password.length >= 8 && form.email.length > 0)
                            submit().catch()
                    }}
                />
                <Button
                    variant={form.password.length < 8 || form.email.length === 0 ? 'outlined' : 'filled'}
                    className={styles.button} onClick={() => submit()}
                    disabled={form.password.length < 8 || form.email.length === 0}>
                    Entrar
                </Button>
            </div>
        </div>
    )
}

Auth.propTypes = {
    handleClose: PropTypes.func,
    isRequired: PropTypes.bool,
    theme: PropTypes.string,
    host: PropTypes.string,
}