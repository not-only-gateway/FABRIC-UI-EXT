import PropTypes from "prop-types";
import styles from '../styles/Auth.module.css'
import {Button, TextField} from "@f-ui/core";
import {useState} from "react";
import {useRequest} from "@f-ui/query";
import Cookies from "universal-cookie/lib";

const cookies = new Cookies()
export default function Auth(props) {
    const [form, setForm] = useState({email: '', password: ''})
    const {make} = useRequest(true)
    const [error, setError] = useState(false)
    const [hidden, setHidden] = useState(true)


    const submit = async () => {
        try {
            const res = await make({
                url: props.host + '/api/authentication',
                method: 'POST',
                data: {...form, email: form.email + '@aeb.gov.br'},
                headers: (new Cookies()).get('jwt')
            })
            if (res?.status === 202) {
                console.log(res.data)
                cookies.set('jwt', res.data.token)
                localStorage.setItem('exp', res.data.exp)
                localStorage.setItem('email', form.email + '@aeb.gov.br')
                props.handleClose()
            } else
                setError(true)
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
                            setError(false)
                        setForm({...form, password: v.target.value})
                    }} value={form.password}
                    width={'100%'} type={hidden ? 'password' : 'text'}
                    helperText={error ? 'Senha ou email não compatíveis' : undefined}
                    onEnter={() => {

                        if (form.password.length >= 8 && form.email.length > 0)
                            submit().catch()
                    }}
                    maskEnd={
                        <Button className={styles.hideButton} onClick={() => setHidden(!hidden)}>
                            <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>{!hidden ? 'visibility' : 'visibility_off'}</span>
                        </Button>
                    }
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