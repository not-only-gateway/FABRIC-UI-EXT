import PropTypes from 'prop-types'
import styles from '../../list/styles/Row.module.css'
import React, {useRef} from 'react'
import keyTemplate from "../../list/templates/keyTemplate";
import SortField from "./SortField";

export default function Sort(props) {
    const ref = useRef()

    return (
        <div className={styles.headerRow} ref={ref}>
            {props.keys.map((e, i) => (
                <React.Fragment key={i + 'header-row-cell'}>
                    <SortField
                        {...props}

                        setSorts={props.setSorts}
                        additionalWidth={e.additionalWidth ? e.additionalWidth : '0px'}
                        value={e} sorts={props.sorts}
                        length={props.keys.length}
                        isLast={i === props.keys.length - 1}
                    />
                </React.Fragment>
            ))}

        </div>
    )
}

Sort.propTypes = {
    setSelectedFilter: PropTypes.func.isRequired,
    selectedFilter: PropTypes.object,
    selectorOpen: PropTypes.bool.isRequired,
    setSelectorOpen: PropTypes.func.isRequired,
    applyFilter: PropTypes.func.isRequired,


    keys: PropTypes.arrayOf(keyTemplate),
    hasOptions: PropTypes.bool,
    setSorts: PropTypes.func,
    sorts: PropTypes.arrayOf(PropTypes.object)
}
