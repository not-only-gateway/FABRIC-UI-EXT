import {Button, Fabric, Navigation, NavigationGroup} from "@f-ui/core";
import styles from "../styles/Home.module.css";
import PropTypes from "prop-types";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";

export default function NavigationTemplate(props) {
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
    return (
        <Fabric theme={theme} className={styles.container}>
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
                </NavigationGroup>
            </Navigation>
            <div className={styles.content}>
                {props.children}
            </div>
        </Fabric>
    )
}
NavigationTemplate.propTypes = {
    children: PropTypes.node,
    pages: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        path: PropTypes.string,
        icon: PropTypes.node,
        align: PropTypes.oneOf(['start', 'end'])
    }))
}