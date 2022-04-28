import React, {useEffect, useMemo, useState} from 'react'
import styles from './styles/Selector.module.css'
import SelectorModal from "./modules/SelectorModal";
import PropTypes from "prop-types";
import shared from './styles/Shared.module.css'
import {Button, DataRow, Dropdown, DropdownOptions, Modal, ToolTip, useListData} from "@f-ui/core";
import useQuery from "../hooks/useQuery";
import Element from "../list/components/Element";
import {VARIANTS} from "../list/List";

export default function Selector(props) {
    const [open, setOpen] = useState(false)
    const hook = useQuery(props.query, props.initialSorts, props.customQuery)
    useEffect(() => {
        if (props.openOnMount) setOpen(true)
    }, [props.openOnMount])

    // const [currentTab, setCurrentTab] = useState(0)
    // const toRender = useMemo(() => {
    //     return props.hook.data.slice(currentTab * 15, currentTab * 15 + 15)
    // }, [props.hook.data, currentTab])
    // const visualizeKeys = useMemo(() => {
    //     return props.keys.filter(k => k.type !== 'image')
    // }, [])
    //
    // const hook = useListData(
    //     visualizeKeys.filter(k => k.visible),
    //     props.hook.data.map(d => {
    //         if (props.mapKeyOnNull && !d.data[props.mapKeyOnNull.key])
    //             return {...d.data, [props.mapKeyOnNull.key]: props.mapKeyOnNull.value(d.data)}
    //         return d.data
    //     }), true)
    //
    // const nodes = toRender.map((e, index) => (
    //     <React.Fragment key={e.id + '-list-row'}>
    //         <Element
    //             setOnValidation={() => null}
    //             onRowClick={() => {
    //                 props.handleChange(e.data)
    //                 props.setOpen(false)
    //             }}
    //             variant={VARIANTS.EMBEDDED}
    //             isLast={index === props.hook.data.length - 1}
    //             data={e.data}
    //             page={currentTab}
    //             fetchPage={props.hook.currentPage}
    //
    //             index={index + currentTab * 15}
    //         />
    //     </React.Fragment>
    // ))


    return (<>

        {!props.openOnMount ? (<div style={{
            width: props.width, maxWidth: props.width, display: 'grid', gap: '4px'
        }}>

            <div
                className={shared.labelContainer}
                style={{
                    visibility: props.value !== null && props.value !== undefined ? 'visible' : 'hidden',
                    opacity: props.value !== null && props.value !== undefined ? '1' : '0',
                    transition: 'visibility 0.2s ease,opacity 0.2s ease',
                    textTransform: 'capitalize',
                }}
            >
                <div className={shared.overflow}>
                    {props.label}
                </div>
            </div>
            <Dropdown
                disabled={props.disabled}
                variant={"outlined"}
                className={styles.buttonWrapper}
                styles={{
                    height: props.height ? props.height : '45px',
                }}
                wrapperClassname={styles.contentWrapper}
            >
                {props.value !== null && props.value !== undefined ? <DataRow
                    styles={{
                        border: 'none', userSelect: 'none', width: '100%'
                    }}

                    keys={props.keys}
                    object={props.value}
                    selfContained={true}
                /> : <div className={[styles.button, shared.labelContainer].join(' ')}>
                    {props.placeholder}
                </div>}

                <DropdownOptions>

                    <SelectorModal
                        {...props}
                        hook={hook}

                    />
                </DropdownOptions>
            </Dropdown>
            <div className={shared.alertLabel}
                 style={{
                     color: props.value === null || props.value === undefined ? '#ff5555' : undefined,
                 }}>
                {props.required ? 'Este campo é obrigatório' : null}
                {props.helperText ? <div className={shared.helperText}>
                    <span className="material-icons-round" style={{fontSize: '1rem'}}>info</span>
                    <ToolTip content={props.helperText} align={'start'}/>
                </div> : null}
            </div>

        </div>) : <Modal
            open={open}
            animationStyle={'none'}
            styles={{transform: 'translate(0, calc(50% + 8px))'}}
            className={styles.contentWrapper}
            variant={"fit"}
            handleClose={() => {
                setOpen(false)
                if (props.handleClose) props.handleClose()
            }}
        >
            <SelectorModal
                {...props}
                hook={hook}
            />

        </Modal>}
    </>)
}

Selector.propTypes = {
    openOnMount: PropTypes.bool,
    handleClose: PropTypes.func,
    helperText: PropTypes.string,
    onClick: PropTypes.func,

    label: PropTypes.any,
    placeholder: PropTypes.any,
    required: PropTypes.bool,
    value: PropTypes.object,
    handleChange: PropTypes.func,
    disabled: PropTypes.bool,
    width: PropTypes.string,

    customQuery: PropTypes.func,
    initialSorts: PropTypes.array,
    query: PropTypes.object.isRequired,

    keys: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['string', 'number', 'object', 'date']),
        maskStart: PropTypes.any,
        maskEnd: PropTypes.any,
        additionalWidth: PropTypes.string
    })).isRequired
}

