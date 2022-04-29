import styles from "./styles/Field.module.css";

import React, {useState} from "react";
import PropTypes from "prop-types";
import keyTemplate from "../list/templates/keyTemplate";
import {Button} from "@f-ui/core";
import Header from "./components/Header";

export default function Filter(props) {
    const [selectedFilter, setSelectedFilter] = useState(undefined)
    const [selectorOpen, setSelectorOpen] = useState(false)

    const applyFilter = (v) => {
        props.setFilters(prevState => {
            return [
                ...prevState,
                (v ? v : selectedFilter)
            ]
        })
        if (selectedFilter.type === 'object')
            setSelectedFilter(undefined)
    }
    return (
        <>
            <div className={styles.activeFilters}>
                {props.filters.map((e, i) => (
                    <div className={styles.filter} key={'filter-key-' + i}>
                        <label className={styles.overflow} style={{fontWeight: 'bold'}}>
                            {e.label}
                        </label>
                        <div className={styles.overflow}>
                            {props.getType(e)}
                        </div>
                        <div className={styles.overflow} style={{fontWeight: 'bold'}}>
                            {e.type === 'object' ? e.objectLabel : e.value}
                        </div>

                        <Button

                            onClick={() => {
                                let newFilters = [...props.filters]
                                newFilters.splice(i, 1)
                                props.setFilters(newFilters)
                            }} className={styles.button}>
                            <span className="material-icons-round" style={{fontSize: '1rem'}}>close</span>
                        </Button>
                    </div>
                ))
                }
            </div>

            <Header
                setSelectedFilter={setSelectedFilter}
                selectedFilter={selectedFilter}
                selectorOpen={selectorOpen}
                setSelectorOpen={setSelectorOpen}
                applyFilter={applyFilter}

                keys={props.keys.filter(e => e.visible === true)}
                sorts={props.hook.sorts}
                setSorts={props.hook.setSorts}
            />
        </>
    )
}

Filter.propTypes = {
    hook: PropTypes.object,
    variant: PropTypes.number,

    keys: PropTypes.arrayOf(keyTemplate).isRequired,
    noFilters: PropTypes.bool,
    filters: PropTypes.array,
    setFilters: PropTypes.func,
    getType: PropTypes.func,
    parseDate: PropTypes.func,
}