import PropTypes from "prop-types";
import {VARIANTS} from "./List";
import styles from './styles/Tabs.module.css'
import {useEffect, useMemo, useState} from "react";
import {Button} from "@f-ui/core";
import DataActions from "../hooks/deps/dataActions";

export default function ListTabs(props) {
    const {currentPage, setCurrentPage} = props.hook
    const {currentTab, setCurrentTab} = props
    useEffect(() => {
        setCurrentTab(0)
    }, [props.variant, props.hook.filters])
    console.log(props.hook.hasMore ,  currentPage-1  === currentTab )

        return (
            <div className={styles.wrapper} style={{display: props.variant === VARIANTS.CARDS ? undefined : 'none'}}>

                <div className={styles.cell}>
                    Página {currentTab} de {currentPage - 1} carregadas
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
                        disabled={!props.hook.hasMore && currentPage-1  === currentTab}
                        variant={"outlined"}
                        styles={{borderRadius: '0  5px 5px  0'}}
                        className={styles.nav}
                        onClick={() => {

                            setCurrentTab(prev => prev + 1)
                            if(currentTab === currentPage-1)
                                setCurrentPage(prev => prev + 1)
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