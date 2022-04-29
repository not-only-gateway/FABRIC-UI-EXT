import styles from "../styles/Element.module.css";
import {DataRow, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import PropTypes from "prop-types";
import React, {useState} from 'react'
import {VARIANTS} from "../List";

export default function Element(props) {
    const [openDropdown, setOpenDropdown] = useState(false)
    const [open, setOpen] = useState(false)

    return (
        <div
            className={[styles.listRow, props.variant === VARIANTS.CARDS ? styles.animation :''].join(' ')}
            style={{animationDelay: (props.index - props.page * 15) * 100 + 'ms'}}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {props.options && (open || openDropdown) ? (
                <Dropdown
                    variant={'filled'}
                    className={[styles.dropdown, props.variant === VARIANTS.CARDS ? styles.card : ''].join(' ')}
                    onOpen={() => setOpenDropdown(true)}
                    onClose={() => setOpenDropdown(false)}>
                    <DropdownOptions>
                        {props.options.map((o, oI) => (
                            <React.Fragment key={oI + 'list-option'}>
                                <DropdownOption
                                    option={{
                                        ...o, onClick: () => {
                                            if (o.validadeChoice)
                                                props.setOnValidation({
                                                    data: props.data,
                                                    message: o.validationMessage,
                                                    onAccept: () => o.onClick(props.data)
                                                })
                                            else
                                                o.onClick(props.data)

                                        }
                                    }}/>
                            </React.Fragment>
                        ))}
                    </DropdownOptions>
                </Dropdown>
            ) : null}

            <DataRow
                asCard={props.variant === VARIANTS.CARDS}
                className={styles.row}
                cellStyles={{maxHeight: '50vh'}}
                styles={{
                    background: props.highlight ? 'var(--fabric-accent-color)' : props.variant === VARIANTS.CARDS || props.linearColor ? 'var(--fabric-background-secondary)' : props.index % 2 === 0 ? 'var(--fabric-background-tertiary)' : undefined,
                    borderRadius: props.variant === VARIANTS.CARDS ? undefined : props.index === 0 ? '5px 5px 0 0' : props.isLast ? '0 0 5px 5px' : 0
                }}
                index={props.index}
                onClick={() => props.onRowClick(props.data)}
                reference={props.lastElementRef}/>
        </div>
    )
}

Element.propTypes = {
    linearColor: PropTypes.bool,
    highlight: PropTypes.bool,

    variant: PropTypes.number,
    setOnValidation: PropTypes.func,
    onRowClick: PropTypes.func,
    lastElementRef: PropTypes.func,
    data: PropTypes.object,
    options: PropTypes.array,
    index: PropTypes.number,
    page: PropTypes.number,
    fetchPage: PropTypes.number
}