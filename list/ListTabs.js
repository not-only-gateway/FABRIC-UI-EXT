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
    }, [props.variant])
    if (props.variant === VARIANTS.CARDS)
        return (
            <div className={styles.wrapper}>
                <Button
                    disabled={currentTab === 0}
                    variant={"outlined"}
                    className={styles.nav}
                    onClick={() => {
                        setCurrentTab(prev => prev - 1)
                    }}>
                    <span className={'material-icons-round'}>chevron_left</span>
                </Button>


                <div className={styles.cell}>
                    {currentTab}
                </div>


                <Button
                    disabled={props.hook.data.length % 15 !== 0}
                    variant={"outlined"}

                    className={styles.nav}
                    onClick={() => {
                        setCurrentPage(prev => prev + 1)
                        setCurrentTab(prev => prev + 1)
                    }}>
                    <span className={'material-icons-round'}>chevron_right</span>
                </Button>
            </div>
        )
    else
        return null
}
ListTabs.propTypes = {
    currentTab: PropTypes.number,
    setCurrentTab: PropTypes.func,
    fetchNext: PropTypes.func,
    hook: PropTypes.object,
    variant: PropTypes.number
}