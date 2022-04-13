import PropTypes from 'prop-types'
import styles from '../styles/Header.module.css'
import React, {useMemo} from "react";
import useHeader from "../hook/useHeader";
import keyTemplate from "../templates/keyTemplate";
import Filter from "../../filter/Filter";

import Sort from "./Sort";
import {Button, Dropdown, DropdownOption, DropdownOptions, ToolTip} from "@f-ui/core";
import {VARIANTS} from "../List";


export default function Header(props) {
    const {
        getType,
        parseDate,
    } = useHeader(props.dispatch, props.actions)
    const options = useMemo(() => {
        const base = [
            {
                label: 'Mínimo',
                icon: 'format_list_bulleted',
                onClick: () => props.setVariant(VARIANTS.MINIMAL),
                variant: VARIANTS.MINIMAL
            },
            {
                label: 'Extendido',
                icon: 'view_list',
                onClick: () => props.setVariant(VARIANTS.EMBEDDED),
                variant: VARIANTS.EMBEDDED
            }
        ]
        if (props.hasCardView)
            base.push({
                label: 'Card',
                icon: 'dashboard',
                onClick: () => props.setVariant(VARIANTS.CARDS),
                variant: VARIANTS.CARDS
            })

        return base
    }, [props.hasCardView])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                {props.title}
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div className={styles.buttonGroup}>
                        {options.map((o, i) => (
                            <React.Fragment key={'bt-' + i}>
                                <Button
                                    styles={{borderRadius: i === 0 ? '3px 0  0 3px' : i === options.length -1 ? ' 0 3px  3px 0 ' : '0'}}
                                    variant={props.variant === o.variant ? 'filled' : "outlined"}
                                    onClick={() => o.onClick()}
                                    className={styles.button}
                                >
                                    <span className="material-icons-round" style={{fontSize: '1.3rem'}}>{o.icon}</span>
                                    <ToolTip>
                                        {o.label}
                                    </ToolTip>
                                </Button>
                            </React.Fragment>
                        ))}
                    </div>

                    <Dropdown hideArrow={true} className={styles.button}>
                        <span className="material-icons-round" style={{fontSize: '1.3rem'}}>more_vert</span>
                        <DropdownOptions>

                            <DropdownOption option={{
                                label: 'Recarregar',
                                icon: <span className="material-icons-round"
                                            style={{fontSize: '1.3rem'}}>refresh</span>,
                                onClick: () => {
                                    props.hook.clean()
                                }
                            }}/>
                            <DropdownOption option={{
                                label: 'Configurações',
                                icon: <span className="material-icons-round"
                                            style={{fontSize: '1.3rem'}}>settings</span>,
                                onClick: () => {
                                    props.setOpenSettings(true)
                                }
                            }}/>

                        </DropdownOptions>
                    </Dropdown>

                    <Button
                        styles={{display: props.createOption ? undefined : 'none', color: 'white'}}
                        onClick={() => props.onCreate()} variant={"filled"}
                        className={styles.button}>
                      <span className="material-icons-round"
                            style={{fontSize: '1.3rem'}}
                      >
                            add
                        </span>
                    </Button>
                </div>
            </div>

            {props.noFilters ?
                null
                :
                <div className={styles.filters}>

                    <Filter
                        keys={props.keys.filter(e => e.type !== 'image' && e.label)} filters={props.hook.filters}
                        setFilters={props.hook.setFilters}
                        getType={getType}
                        parseDate={parseDate}
                        noFilters={props.noFilters}
                    />
                </div>
            }
            {props.variant !== VARIANTS.CARDS ?
                <Sort
                    keys={props.keys.filter(e => e.visible === true)}
                    sorts={props.hook.sorts}
                    setSorts={props.hook.setSorts}

                />
            :
            null}
        </div>

    )
}

Header.propTypes = {
    variant: PropTypes.number,
    setVariant: PropTypes.func,
    hasCardView: PropTypes.bool,

    hook: PropTypes.object,
    noFilters: PropTypes.bool,
    dispatch: PropTypes.func,
    actions: PropTypes.object,

    title: PropTypes.any,

    keys: PropTypes.arrayOf(keyTemplate).isRequired,

    setOpenSettings: PropTypes.func,

    createOption: PropTypes.bool,
    onCreate: PropTypes.func,


    setSelfContained: PropTypes.func,
    selfContained: PropTypes.bool
}
