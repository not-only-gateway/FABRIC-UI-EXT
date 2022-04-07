import {Button, Dropdown, DropdownOption, DropdownOptions, Fabric, Navigation, NavigationGroup} from "@f-ui/core";
import styles from "./styles/Wrapper.module.css";
import PropTypes from "prop-types";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";
import Cookies from "universal-cookie/lib";
import useProfile from "./hooks/useProfile";
import Auth from "./components/Auth";

const cookies = new Cookies()
export default function Wrapper(props) {
    const router = useRouter()
    const [theme, setTheme] = useState()
    useEffect(() => {
        setTheme(localStorage.getItem('theme'))
    }, [])
    const end = useMemo(() => {
        return props.pages.filter(p => p.align === 'end')
    }, [props.pages])
    const start = useMemo(() => {
        return props.pages.filter(p => p.align !== 'end')
    }, [props.pages])
    const {onProfile, setOnProfile, profileData, logged, setLogged, refreshProfile} = useProfile(props.host)
    const [onAuth, setOnAuth] = useState(false)
    const [requiredAuth, setRequiredAuth] = useState(false)
    const refresh = () => {
        const found = props.pages.find(p => p.path === router.pathname)
        if (found && found.requireAuth && !cookies.get('jwt')) {
            setOnAuth(true)
            setRequiredAuth(true)
        } else
            setRequiredAuth(false)
    }
    useEffect(() => {
        refresh()
    }, [router.pathname])

    return (
        <Fabric theme={theme} className={styles.container}>
            {onAuth ?
                (
                    <Auth
                        theme={theme}
                        host={props.host}
                        isRequired={requiredAuth}
                        handleClose={() => {
                            setOnAuth(false)
                            refreshProfile()
                        }}
                    />
                ) :
                (
                    <>
                        <Navigation>
                            <NavigationGroup justify={'start'}>
                                <img className={styles.logo} src={theme + '.png'} alt={'logo'}/>
                                {start.map((p, i) => (
                                    <Button
                                        className={styles.button}
                                        attributes={{key: i + '-wrapper-option-start'}}
                                        onClick={() => router.push(p.path)}>
                                        {p.icon}
                                        {p.label}
                                    </Button>

                                ))}
                            </NavigationGroup>

                            <NavigationGroup justify={'end'}>
                                {end.map((p, i) => (
                                    <Button
                                        className={styles.button}
                                        attributes={{key: i + '-wrapper-option-end'}}
                                        onClick={() => router.push(p.path)}
                                    >
                                        {p.icon}
                                        {p.label}
                                    </Button>

                                ))}
                                <Button
                                    className={styles.button}
                                    onClick={() => {
                                        setTheme(theme === 'dark' ? 'light' : 'dark')
                                        localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark')
                                    }}>
                                    <span className={'material-icons-round'}>{theme + '_mode'}</span>
                                </Button>
                                {logged && Object.keys(profileData).length > 0 ?
                                    <Dropdown className={styles.dropdown}  >
                                        {profileData.pic ?
                                            <img className={styles.avatar} src={profileData.pic} alt={'logo'}/>
                                            :
                                            <span className={'material-icons-round'}>account_circle</span>
                                        }
                                        {profileData.name.split(' ').shift()}
                                        <DropdownOptions>
                                            <div className={styles.profile}>
                                                {profileData.pic ?
                                                    <img className={styles.avatarBig} src={profileData.pic}
                                                         alt={'logo'}/>
                                                    :
                                                    <span style={{fontSize: '3rem'}}
                                                          className={'material-icons-round'}>account_circle</span>
                                                }
                                                {profileData.name}
                                                <div className={styles.emailWrapper}>
                                                    {profileData.user_email}
                                                </div>
                                            </div>
                                            <DropdownOption
                                                option={{
                                                    onClick: () => {
                                                        refreshProfile()
                                                        setOnProfile(true)
                                                    },
                                                    icon: <span className={'material-icons-round'}
                                                                style={{fontSize: '1.1rem'}}>edit</span>,
                                                    label: 'Meu perfil'
                                                }}
                                                styles={{
                                                    borderBottom: 'var(--fabric-border-primary) 1px solid',
                                                    padding: '2px 0'
                                                }}
                                            />
                                            <DropdownOption
                                                option={{
                                                    onClick: () => {
                                                        localStorage.removeItem('email')
                                                        localStorage.removeItem('exp')
                                                        cookies.remove('jwt')

                                                        refresh()
                                                    },
                                                    icon: <span className={'material-icons-round'}
                                                                style={{fontSize: '1.1rem'}}>logout</span>,
                                                    label: 'Sair'
                                                }}
                                                styles={{
                                                    borderBottom: 'var(--fabric-border-primary) 1px solid',
                                                    padding: '2px 0'
                                                }}
                                            />
                                        </DropdownOptions>
                                    </Dropdown>
                                    :
                                    <Button
                                        className={styles.button}
                                        onClick={() => setOnAuth(true)}>
                                        <span className={'material-icons-round'}>login</span>
                                    </Button>
                                }

                            </NavigationGroup>

                        </Navigation>
                        <div className={styles.content}>
                            {props.children}
                        </div>
                    </>
                )}
        </Fabric>
    )
}
Wrapper.propTypes = {
    children: PropTypes.node,
    pages: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        path: PropTypes.string,
        icon: PropTypes.node,
        align: PropTypes.oneOf(['start', 'end']),
        requireAuth: PropTypes.bool
    })),
    host: PropTypes.string.isRequired

}