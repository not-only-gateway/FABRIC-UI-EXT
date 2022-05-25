import PropTypes from "prop-types";
import styles from '../styles/Auth.module.css'
import {Button, TextField} from "@f-ui/core";
import {useState} from "react";
import {useRequest} from "@f-ui/query";
import Cookies from "universal-cookie/lib";
import SECURITY from "../../SECURITY";
import {v4} from "uuid";

const cookies = new Cookies()
export default function Auth(props) {
    const [form, setForm] = useState({email: '', password: '', security: ''})
    const {make} = useRequest(true)
    const [error, setError] = useState(undefined)
    const [adminError, setAdminError] = useState(undefined)
    const [hidden, setHidden] = useState(true)


    const submit = async (asADM) => {
        try {
            const res = await make({
                url: props.host + '/api/authentication',
                method: 'POST',
                data: {...form, email: form.email + '@aeb.gov.br'},
                headers: (new Cookies()).get('jwt')
            })
            if (res?.status === 202) {
                cookies.set('jwt', res.data.token)
                localStorage.setItem('exp', res.data.exp)
                localStorage.setItem('email', form.email + '@aeb.gov.br')
                if(asADM)
                    sessionStorage.setItem('token', v4().toString())
                props.handleClose()
            } else
                setError('Senha ou email não compatíveis')
        } catch (e) {
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
                            setError(undefined)
                        setForm({...form, password: v.target.value})
                    }} value={form.password}
                    width={'100%'} type={hidden ? 'password' : 'text'}
                    helperText={error}
                    onEnter={() => {

                        if (form.password.length >= 8 && form.email.length > 0)
                            submit().catch()
                    }}
                    maskEnd={
                        <Button className={styles.hideButton} onClick={() => setHidden(!hidden)}>
                            <span className={'material-icons-round'}
                                  style={{fontSize: '1.2rem'}}>{!hidden ? 'visibility' : 'visibility_off'}</span>
                        </Button>
                    }
                />
                <TextField
                    label={'Chave de administrador'}
                    placeholder={'Chave de administrador'}
                    handleChange={(v) => {
                        if (adminError)
                            setAdminError(undefined)
                        setForm({...form, security: v.target.value})
                    }} value={form.security}
                    width={'100%'} type={hidden ? 'password' : 'text'}
                    maskEnd={
                        <Button className={styles.hideButton} onClick={() => setHidden(!hidden)}>
                            <span className={'material-icons-round'}
                                  style={{fontSize: '1.2rem'}}>{!hidden ? 'visibility' : 'visibility_off'}</span>
                        </Button>
                    }
                />
                <div className={styles.inline}>
                    <Button
                        variant={"outlined"}
                        attributes={{
                            title: 'Entrar como administrador'
                        }}
                        className={styles.button} onClick={() => submit(true)}
                        disabled={form.password.length < 8 || form.email.length === 0|| adminError || form.security !== SECURITY}>
                        <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>key</span>
                        <label className={styles.overflow}>
                            Entrar como administrador
                        </label>
                    </Button>
                    <Button
                        variant={form.password.length < 8 || form.email.length === 0 ? 'outlined' : 'filled'}
                        className={styles.button} onClick={() => submit()}
                        disabled={form.password.length < 8 || form.email.length === 0}>
                        <label className={styles.overflow}>
                            Entrar
                        </label>
                    </Button>
                </div>
            </div>
        </div>
    )
}

Auth.propTypes = {
    admToken: PropTypes.string,
    setAdmToken: PropTypes.func,
    handleClose: PropTypes.func,
    isRequired: PropTypes.bool,
    theme: PropTypes.string,
    host: PropTypes.string,
}