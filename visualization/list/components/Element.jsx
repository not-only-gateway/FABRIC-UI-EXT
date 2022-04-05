import styles from "../styles/Element.module.css";
import {DataRow, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import PropTypes from "prop-types";
import React, {useState} from 'react'

export default function Element(props) {
    const [openDropdown, setOpenDropdown] = useState(false)
    const [open, setOpen] = useState(false)
    return (
        <div
            className={styles.listRow}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {props.options && (open || openDropdown)? (
                <Dropdown className={styles.dropdown} onOpen={() => setOpenDropdown(true)} onClose={() => setOpenDropdown(false)}>
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

                className={styles.row}
                styles={{
                    background: props.index % 2 === 0 ? 'var(--fabric-background-tertiary)' : undefined,
                    borderRadius: props.index === 0 ? '5px 5px 0 0' : props.isLast ? '0 0 5px 5px' : 0
                }}
                index={props.index} onClick={() => props.onRowClick(props.data)} reference={props.lastElementRef}/>
        </div>
    )
}

Element.propTypes = {
    setOnValidation: PropTypes.func,
    onRowClick: PropTypes.func,
    lastElementRef: PropTypes.object,
    data: PropTypes.object,
    options: PropTypes.array,
    index: PropTypes.number,
    isLast: PropTypes.bool
}