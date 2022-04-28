import PropTypes from "prop-types";
import React, {useEffect, useMemo, useRef, useState} from "react";

import styles from '../../list/styles/Row.module.css'
import keyTemplate from "../../list/templates/keyTemplate";
import {Button, Dropdown, DropdownOptions, ToolTip} from "@f-ui/core";

import Field from "./Field";


const getIcon = (type) => {
    let icon
    switch (type) {
        case 'date': {
            icon = <span className="material-icons-round" style={{fontSize: '1.2rem'}}>calendar_today</span>
            break
        }

        case 'string': {
            icon = <span className="material-icons-round" style={{fontSize: '1.2rem'}}>text_fields</span>
            break
        }
        case 'object': {
            icon = <span className="material-icons-round" style={{fontSize: '1.2rem'}}>link</span>
            break
        }
        default: {
            icon = <span className="material-icons-round" style={{fontSize: '1.2rem'}}>category</span>
            break
        }
    }

    return icon
}

function getField (e, setSelectedFilter) {
    return {
        icon: getIcon(e.type),
        label: (
            <div style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%', width: '100%'}}>
                {e.label}
                <ToolTip content={e.label}/>
            </div>
        ),
        onClick: () => {
            const op = e.type !== 'object' ? (e.type === 'string' ? {contains: true} : {greater_than: true}) : {}
            setSelectedFilter({
                ...e,
                ...op
            })
        }
    }
}

export default function CellHeader(props) {
    const ref = useRef()
    const [open, setOpen] = useState(false)
    const [currentSort, setCurrentSort] = useState()
    useEffect(() => {
        if (props.sorts[0] && props.sorts[0].key === props.value.key) setCurrentSort(props.sorts[0].asc ? 'asc' : 'desc')
    }, [])
    useEffect(() => {
        if (!props.sorts[0] || props.sorts[0].key !== props.value.key) setCurrentSort(undefined)
    }, [props.sorts])
    const field = useMemo(() => {
        return getField(props.value, props.setSelectedFilter)
    }, [props])


    if (props.value.type === 'object') return (<div
        className={styles.cell}
        style={{borderRight: !props.isLast ? 'var(--fabric-background-tertiary) 1px solid' : undefined}}
    >

            {field.label}

        <Button
            className={styles.option}
            variant={open ? 'filled' : undefined}

            onClick={() => {
                props.setSelectedFilter(props.value)
            }}
        >
            <span className={'material-icons-round'} style={{fontSize: '1rem'}}>more_vert</span>
        </Button>
        {props.selectedFilter && props.selectedFilter.key === props.value.key ? <Field
            handleClose={() => props.setSelectedFilter(undefined)}
            setFilters={props.setFilters}
            filters={props.filters}
            selectedField={props.selectedFilter}
            setSelectedField={props.setSelectedFilter}
            selectorOpen={props.selectorOpen}
            keys={props.keys}
            setSelectorOpen={props.setSelectorOpen}

            applyFilter={props.applyFilter}
        /> : null}
    </div>)

    return (<div
        className={styles.cell}
        style={{borderRight: !props.isLast ? 'var(--fabric-background-tertiary) 1px solid' : undefined}}
    >

        <div style={{display: 'flex', gap: '2px', alignItems: 'center'}}>
            {field.label}
            <Button
                className={[styles.option, 'material-icons-round'].join(' ')}

                styles={{fontSize: '1rem', color: !currentSort ? '#999999' : undefined}}
                onClick={() => {
                    switch (currentSort) {
                        case 'desc':
                            setCurrentSort('asc')
                            props.setSorts([{
                                key: props.value.key, asc: true, desc: false
                            }])
                            break
                        case 'asc':
                            setCurrentSort(undefined)
                            props.setSorts([])
                            break
                        default:
                            setCurrentSort('desc')
                            props.setSorts([{
                                key: props.value.key, asc: false, desc: true
                            }])
                            break
                    }
                }}
                reference={ref}
            >
                {currentSort === 'desc' || !currentSort ? 'arrow_downward' : 'arrow_upward'}
            </Button>
        </div>
        <Dropdown
            className={styles.option}
            wrapperClassname={styles.cellWrapper}
            hideArrow={true}
            variant={open ? 'filled' : "outlined"}
            onOpen={() => {
                props.setSelectedFilter({...props.value, greater_than: true, contains: true})
                setOpen(true)
            }}
            onClose={() => setOpen(false)}
        >
            <span className={'material-icons-round'} style={{fontSize: '1rem'}}>more_vert</span>
            <DropdownOptions>

                    <div className={styles.group}>
                        <label className={styles.label}>Aplicar pesquisa</label>
                        <Field
                            handleClose={() => props.setSelectedFilter(undefined)}
                            setFilters={props.setFilters}
                            filters={props.filters}
                            selectedField={props.selectedFilter}
                            setSelectedField={props.setSelectedFilter}
                            selectorOpen={props.selectorOpen}
                            keys={props.keys}
                            setSelectorOpen={props.setSelectorOpen}

                            applyFilter={props.applyFilter}
                        />
                    </div>

            </DropdownOptions>
        </Dropdown>

    </div>)
}

CellHeader.propTypes = {
    setSelectedFilter: PropTypes.func.isRequired,
    selectedFilter: PropTypes.object,
    selectorOpen: PropTypes.bool.isRequired,
    setSelectorOpen: PropTypes.func.isRequired,
    applyFilter: PropTypes.func.isRequired,

    isLast: PropTypes.bool,


    length: PropTypes.number,
    additionalWidth: PropTypes.string,
    value: keyTemplate,
    sorts: PropTypes.array,
    setSorts: PropTypes.func
}