import {Button, Dropdown, DropdownOption, DropdownOptions, Fabric, Switcher} from "@f-ui/core";
import styles from "./styles/Wrapper.module.css";
import PropTypes from "prop-types";
import Router, {useRouter} from "next/router";
import React, {useEffect, useMemo, useState} from "react";
import Cookies from "universal-cookie/lib";
import useProfile from "./hooks/useProfile";
import Auth from "./components/Auth";
import Navigation from "../nav/Navigation";
import NavigationGroup from "../nav/NavigationGroup";
import Profile from "./components/Profile";
import {Avatar} from "@f-ui/query";
import Head from "next/head";

const cookies = new Cookies()
export default function Wrapper(props) {
    const router = useRouter()
    const [theme, setTheme] = useState()
    useEffect(() => {
        const t = localStorage.getItem('theme')
        setTheme(t ? t : 'dark')
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
        } else setRequiredAuth(false)
    }
    useEffect(() => {
        refresh()
    }, [router.pathname])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        Router.events.on('routeChangeStart', () => {
            setLoading(true)
        })
        Router.events.on('routeChangeComplete', () => setLoading(false))
    }, [])


    return (<Fabric
        accentColor={'#0095ff'}
        theme={theme} className={styles.container}

        styles={{background: onProfile ? 'var(--fabric-background-tertiary)' : undefined}}>
        <Head>
            <title>
                {props.titles ? props.titles[router.pathname] : 'SISTEMA'}
            </title>

            <link rel='icon' href={'/dark-small.png'} type='image/x-icon'/>
        </Head>
        <div className={styles.loadWrapper} style={{display: loading ? undefined : 'none'}}>
            <div className={styles.loading}/>
        </div>
        {onAuth ? (
            <Auth
                theme={theme}
                host={props.host}
                isRequired={requiredAuth}
                handleClose={() => {
                    setOnAuth(false)
                    refreshProfile()
                }}
            />
        ) : (<>
            <Navigation>
                <NavigationGroup justify={'start'}>
                    <img
                        title={'SIS-AEB'}
                        className={styles.logo}
                        onClick={() => {
                            setOnProfile(false)
                            if (!requiredAuth) setOnAuth(false)
                            router.push('/')
                        }}
                        src={theme + '.png'}
                        alt={'logo'}
                    />
                    {start.map((p, i) => (<React.Fragment key={i + '-wrapper-option-start'}>
                        {i === 0 ? <div className={styles.divider}/> : null}
                        <Button
                            className={styles.button}
                            variant={"minimal-horizontal"}
                            highlight={router.pathname === p.path}
                            styles={{padding: '0 8px', width: 'fit-content'}}
                            onClick={() => router.push(p.path)}
                        >
                            {p.icon}
                            {p.label}
                        </Button>
                        {i < start.length - 1 ? <div className={styles.divider}/> : null}
                    </React.Fragment>))}
                </NavigationGroup>

                <NavigationGroup justify={'end'}>
                    {end.map((p, i) => (<React.Fragment key={i + '-wrapper-option-end'}>
                        <Button
                            className={styles.button}
                            variant={"minimal-horizontal"}
                            highlight={router.pathname === p.path}
                            styles={{padding: '0 8px', width: 'fit-content'}}
                            onClick={() => router.push(p.path)}
                        >
                            {p.icon}
                            {p.label}
                        </Button>
                        {i < end.length - 1 ? <div className={styles.divider}/> : null}
                    </React.Fragment>))}
                    <Button
                        className={styles.button}
                        onClick={() => {
                            setTheme(theme === 'dark' ? 'light' : 'dark')
                            localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark')
                        }}>
                        <span className={'material-icons-round'}>{theme + '_mode'}</span>
                    </Button>
                    <div className={styles.divider}/>
                    {logged && Object.keys(profileData).length > 0 ? <Dropdown className={styles.dropdown}>
                        <Avatar alt={'Img'} src={profileData.pic}/>
                        {profileData.name.split(' ').shift()}
                        <DropdownOptions>
                            <div className={styles.profile}>
                                <Avatar alt={'Img'} src={profileData.pic} size={"medium"}/>
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
                                    }, icon: <span className={'material-icons-round'}
                                                   style={{fontSize: '1.1rem'}}>edit</span>, label: 'Meu perfil'
                                }}
                                styles={{
                                    borderBottom: 'var(--fabric-border-primary) 1px solid', padding: '2px 0'
                                }}
                            />
                            <DropdownOption
                                option={{
                                    onClick: () => {
                                        localStorage.removeItem('email')
                                        localStorage.removeItem('exp')
                                        cookies.remove('jwt')

                                        refresh()
                                    }, icon: <span className={'material-icons-round'}
                                                   style={{fontSize: '1.1rem'}}>logout</span>, label: 'Sair'
                                }}
                                styles={{
                                    borderBottom: 'var(--fabric-border-primary) 1px solid', padding: '2px 0'
                                }}
                            />
                        </DropdownOptions>
                    </Dropdown> : <Button
                        className={styles.button}

                        onClick={() => setOnAuth(true)}>
                        <span className={'material-icons-round'}>login</span>
                    </Button>}

                </NavigationGroup>

            </Navigation>
            <Switcher openChild={onProfile ? 0 : 1} className={styles.content}>
                <Profile
                    refreshProfile={refreshProfile}
                    host={props.host} handleClose={() => setOnProfile(false)}
                    profileData={profileData}/>
                {props.children}
            </Switcher>
        </>)}
    </Fabric>)
}
Wrapper.propTypes = {
    titles: PropTypes.object, children: PropTypes.node, pages: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        path: PropTypes.string,
        icon: PropTypes.node,
        align: PropTypes.oneOf(['start', 'end']),
        requireAuth: PropTypes.bool
    })), host: PropTypes.string.isRequired

}