import PropTypes from "prop-types";
import React, {useMemo, useRef, useState} from "react";

import styles from '../../list/styles/Row.module.css'
import keyTemplate from "../../list/templates/keyTemplate";
import {Button, Dropdown, DropdownOptions} from "@f-ui/core";
import {getField} from "../Filter";
import Field from "./Field";

export default function SortField(props) {
    const ref = useRef()
    const [open, setOpen] = useState(false)
    const [currentSort, setCurrentSort] = useState()
    const field = useMemo(() => {
        return getField(props.value, props.setSelectedFilter)
    }, [props])

    const sortName = useMemo(() => {
        switch (currentSort) {
            case 'desc':
                return 'Decrescente'
            case 'asc':
                return 'Crescente'
            default:
                return 'Não aplicado'
        }
    }, [currentSort])

    if (props.value.type === 'object')
        return (
            <Button
                className={styles.cell}

                variant={open ? 'filled' : "outlined"}
                onClick={() => {
                    props.setSelectedFilter(props.value)
                }}
                styles={{borderRightColor: !props.isLast ? 'var(--fabric-background-tertiary)' : undefined}}
            >
                 {field.label}
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>more_vert</span>
                {props.selectedFilter && props.selectedFilter.key === props.value.key ?
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
                    :
                    null
                }
            </Button>
        )
    else
        return (
            <Dropdown
                className={styles.cell}
                wrapperClassname={styles.cellWrapper}
                hideArrow={true}
                variant={open ? 'filled' : "outlined"}
                onOpen={() => {
                    props.setSelectedFilter({...props.value, greater_than: true, contains: true})
                    setOpen(true)
                }}
                onClose={() => setOpen(false)}
                styles={{borderRightColor: !props.isLast ? 'var(--fabric-background-tertiary)' : undefined}}
            >
                {field.label}
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>more_vert</span>
                <DropdownOptions>
                    <div style={{display: 'grid', gap: '4px'}}>

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
                        <div className={styles.group}>
                            <label className={styles.label}>Ordenação</label>
                            <Button
                                className={styles.buttonSort}
                                disabled={props.value.type === 'object'}
                                variant={"outlined"}
                                onClick={() => {
                                    switch (currentSort) {
                                        case 'desc': {
                                            setCurrentSort('asc')
                                            props.setSorts([{
                                                key: props.value.key,
                                                asc: true,
                                                desc: false
                                            }])
                                            break
                                        }
                                        case 'asc': {
                                            setCurrentSort(undefined)

                                            props.setSorts([])

                                            break
                                        }
                                        default: {
                                            setCurrentSort('desc')

                                            props.setSorts([{
                                                key: props.value.key,
                                                asc: false,
                                                desc: true
                                            }])
                                            break
                                        }
                                    }
                                }}
                                reference={ref}
                            >
                                {sortName}
                            </Button>
                        </div>
                    </div>

                </DropdownOptions>
            </Dropdown>
        )
}

SortField.propTypes = {
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