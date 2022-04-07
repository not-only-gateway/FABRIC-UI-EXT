import styles from "./styles/Field.module.css";

import React, {useState} from "react";
import PropTypes from "prop-types";
import keyTemplate from "../list/templates/keyTemplate";

import Field from "./templates/Field";
import {Button, Dropdown, DropdownOptions, Modal, TextField, ToolTip} from "@f-ui/core";


export default function Filter(props) {
    const [selectedFilter, setSelectedFilter] = useState(undefined)
    const [selectorOpen, setSelectorOpen] = useState(false)
    const getField = (e) => {
        return {
            icon: getIcon(e.type),
            label: (
                <div style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%'}}>
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
    const [searchString, setSearchString] = useState('')
    return (
        <>
            <Dropdown
                wrapperClassname={styles.mainButtonWrapper}
                styles={{display: !props.noFilters ? undefined : 'none'}}
                variant={"outlined"}
                className={styles.mainButton}>
                Filtrar
                <DropdownOptions>

                    <div className={styles.filters}>
                        <label className={styles.header}>
                            Filtros <TextField
                            handleChange={v => setSearchString(v.target.value)}
                            height={'20px'}
                            width={'100%'}
                            value={searchString}
                            placeholder={'Pesquisar campo'}/>
                        </label>
                        {props.keys.map((k, i) => {
                            if (k.label.toLowerCase().includes(searchString.toLowerCase())) {
                                const button = getField(k)
                                return (
                                    <React.Fragment key={i + '-filter'}>
                                        <Button
                                            highlight={selectedFilter?.key === k.key}
                                            onClick={button.onClick}
                                            styles={{background: i % 2 === 0 ? 'var(--fabric-background-primary)' : 'var(--fabric-background-tertiary)'}}
                                            className={styles.filterButton}
                                        >
                                            {button.icon}
                                            {button.label}

                                            <span className={'material-icons-round'}
                                                  style={{position: 'absolute', right: 0}}>chevron_right</span>
                                        </Button>
                                    </React.Fragment>
                                )
                            } else
                                return null
                        })}
                    </div>


                </DropdownOptions>
            </Dropdown>
            {selectedFilter?.type === 'object' ? (
                    <Field
                        setFilters={props.setFilters}
                        filters={props.filters}
                        selectedField={selectedFilter}
                        setSelectedField={setSelectedFilter} selectorOpen={selectorOpen}
                        keys={props.keys}
                        handleClose={() => {
                        console.log('ON CLOSE')
                        setSelectedFilter(undefined)
                    }}
                        setSelectorOpen={setSelectorOpen}
                        applyFilter={() => {
                            props.setFilters(prevState => {
                                return [
                                    ...prevState,
                                    selectedFilter
                                ]
                            })
                            setSelectedFilter(undefined)
                        }}
                    />
                )
                :
                (
                    <Modal
                        variant={'fill'} blurIntensity={'1px'}
                        open={selectedFilter !== undefined} className={styles.modalWrapper}
                        handleClose={(event) => {
                            setSelectedFilter(undefined)
                        }}
                    >
                        <Field
                            setFilters={props.setFilters}
                            filters={props.filters}
                            selectedField={selectedFilter}
                            setSelectedField={setSelectedFilter} selectorOpen={selectorOpen}
                            keys={props.keys}
                            setSelectorOpen={setSelectorOpen}
                            applyFilter={() => {

                                props.setFilters(prevState => {
                                    return [
                                        ...prevState,
                                        selectedFilter
                                    ]
                                })
                                setSelectedFilter(undefined)
                            }}
                        />
                    </Modal>
                )}


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
                        color={'secondary'}

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

        </>
    )
}

Filter.propTypes = {
    keys: PropTypes.arrayOf(keyTemplate).isRequired,
    noFilters: PropTypes.bool,
    filters: PropTypes.array,
    setFilters: PropTypes.func,
    getType: PropTypes.func,
    parseDate: PropTypes.func,
}