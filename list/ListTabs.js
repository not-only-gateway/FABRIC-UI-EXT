import PropTypes from "prop-types";
import {VARIANTS} from "./List";
import styles from './styles/Tabs.module.css'
import {useEffect, useMemo} from "react";
import {Button} from "@f-ui/core";

export default function ListTabs(props) {
    const {currentPage, setCurrentPage} = props.hook
    const {currentTab, setCurrentTab} = props
    useEffect(() => {
        setCurrentTab(0)
    }, [props.variant, props.hook.filters])
    console.log(props.hook.hasMore, currentPage - 1 === currentTab)
    const p = useMemo(() => {
        return currentPage - 1 >= 0 ? currentPage - 1 : 0
    }, [currentPage])
    return (
        <div className={styles.wrapper} style={{display: props.variant === VARIANTS.CARDS ? undefined : 'none'}}>

            <div className={styles.cell}>
                Página {currentTab} de {p} carregadas
            </div>

            <div className={styles.group}>
                <Button
                    disabled={currentTab === 0}
                    styles={{borderRadius: '5px 0 0  5px'}}
                    variant={"outlined"}
                    className={styles.nav}
                    onClick={() => {
                        setCurrentTab(prev => prev - 1)
                    }}>
                    <span className={'material-icons-round'}>chevron_left</span>
                </Button>

                <Button
                    disabled={!props.hook.hasMore && p === currentTab || props.hook.data.length < 15}
                    variant={"outlined"}
                    styles={{borderRadius: '0  5px 5px  0'}}
                    className={styles.nav}
                    onClick={() => {
                        const t = currentTab
                        setCurrentTab(prev => prev + 1)
                        console.log(p, currentTab, currentPage, t >= p)
                        if (t >= p)
                            setCurrentPage(prev => prev + (currentTab === currentPage ? 2 : 1))
                    }}>
                    <span className={'material-icons-round'}>chevron_right</span>
                </Button>
            </div>
        </div>
    )

}
ListTabs.propTypes = {
    currentTab: PropTypes.number,
    setCurrentTab: PropTypes.func,
    fetchNext: PropTypes.func,
    hook: PropTypes.object,
    variant: PropTypes.number
}