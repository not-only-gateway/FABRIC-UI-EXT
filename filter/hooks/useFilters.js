import React, {useCallback, useMemo, useState} from "react";

import styles from '../../list/styles/Header.module.css'

import Selector from "../../selector/Selector";
import {Checkbox, DateField, TextField} from "@f-ui/core";

export default function useFilter(filter, setFilter, setSelectorOpen, selectorOpen, applyFilter) {
    const [onInput, setOnInput] = useState(undefined)
    const [changed, setChanged] = useState(false)
    const query = useMemo(() => {
        return filter?.query ? filter.query : {}
    }, [filter])


    const handleChange = (value) => {
        setFilter(prevState => {
            if (filter.type === 'object')
                return {
                    ...prevState,
                    value: value[query.primaryKey],
                    objectLabel: value[query?.keys[0]?.key]
                }
            else
                return {
                    ...prevState,
                    value: value
                }
        })

        setChanged(true)
    }
    const getField = useCallback((handleClose) => {
        let field

        const baseProps = {
            type: filter.type,
            key: filter.key,
            label: filter.label
        }
        const dateNumber = (val) => (
            <div className={styles.fieldWrapper}>
                {val}

                <div className={styles.options}>
                    <Checkbox
                        width={'100%'}
                        noMargin={true}
                        checked={filter.greater_than}
                        handleCheck={() => {
                            setFilter(prevState => {
                                return {...baseProps, ...{value: prevState.value, greater_than: true}}
                            })
                        }}
                        label={'Maior que.'}
                    />

                    <Checkbox
                        width={'100%'}
                        noMargin={true}
                        checked={filter.less_than}
                        handleCheck={() => {
                            setFilter(prevState => {
                                return {...baseProps, ...{value: prevState.value, less_than: true}}
                            })
                        }}
                        label={'Menor que.'}
                    />


                    <Checkbox
                        width={'100%'}
                        noMargin={true}
                        checked={filter.equal_to}
                        handleCheck={() => {
                            setFilter(prevState => {
                                return {...baseProps, ...{value: prevState.value, equal_to: true}}
                            })
                        }}
                        label={'Iqual a'}
                    />

                </div>

            </div>
        )
        switch (filter.type) {
            case 'string': {
                field = (
                    <div className={styles.fieldWrapper}>
                        <TextField
                            width={'100%'} disabled={false}
                            handleChange={value => handleChange(value.target.value)}
                            value={filter.value}
                            placeholder={filter.label}
                            noMargin={true}
                            onEnter={() => {
                                if (filter.value.length > 0)
                                    applyFilter()
                            }}
                        />


                        <div className={styles.options}>
                            <Checkbox
                                noMargin={true}
                                width={'100%'}
                                checked={filter.equal_to}
                                handleCheck={() => {
                                    setFilter(prevState => {
                                        return {...baseProps, ...{value: prevState.value, equal_to: true}}
                                    })
                                }}
                                label={'É igual a'}
                            />
                            <Checkbox
                                noMargin={true}
                                width={'100%'}
                                checked={filter.different_from}
                                handleCheck={() => {
                                    setFilter(prevState => {
                                        return {...baseProps, ...{value: prevState.value, different_from: true}}
                                    })
                                }}
                                label={'Não é'}
                            />

                            <Checkbox
                                noMargin={true}
                                width={'100%'}
                                checked={filter.contains}
                                handleCheck={() => {
                                    setFilter(prevState => {
                                        return {...baseProps, ...{value: prevState.value, contains: true}}
                                    })
                                }}
                                label={'Contém'}
                            />
                        </div>
                    </div>
                )
                break
            }
            case 'number': {
                field = dateNumber((
                    <TextField
                        width={'100%'}
                        disabled={false} required={false}
                        handleChange={value => handleChange(value.target.value)}
                        type={'number'} placeholder={filter.label}
                        value={filter.value}
                        onEnter={() => {
                            if (filter.value.toString().length > 0)
                                applyFilter()
                        }}
                    />
                ))
                break
            }
            case 'object': {
                field = (
                    <Selector
                        openOnMount={true}
                        query={query}
                        keys={query && query.keys ? query.keys : []}
                        open={selectorOpen}
                        onClick={() => setSelectorOpen(true)}
                        handleClose={() => {
                            handleClose()
                            setSelectorOpen(false)
                        }}
                        handleChange={entity => {
                            applyFilter({
                                ...filter,
                                value: entity[query.primaryKey],
                                objectLabel: entity[query?.keys[0]?.key]
                            })
                        }}
                        value={filter.value}
                        label={filter.label}
                        required={false}
                        placeholder={filter.label}
                        width={'100%'}/>
                )
                break
            }
            case 'date': {
                field = dateNumber((
                    <DateField
                        noMargin={true}
                        placeholder={filter.label}
                        width={'100%'} disabled={false} required={false}
                        handleChange={value => handleChange(value)}
                        value={filter.value}
                        onEnter={() => {
                            let timestamp = new Date(filter.value);
                            if (timestamp.toString() !== 'Invalid Date')
                                applyFilter()
                        }}
                    />
                ))
                break
            }
            default :
                break

        }
        return field
    }, [filter])

    return {getField, changed, setChanged, onInput, setOnInput}
}
