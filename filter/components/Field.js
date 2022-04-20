import PropTypes from 'prop-types'
import styles from '../styles/Field.module.css'
import useFilter from "../hooks/useFilters";
import React from 'react'
import keyTemplate from "../../list/templates/keyTemplate";
import {Button} from "@f-ui/core";


export default function Field(props) {
    const {
        getField,
        changed
    } = useFilter(props.selectedField, props.setSelectedField, props.setSelectorOpen, props.selectorOpen,props.applyFilter)

    if (props.selectedField?.type !== 'object')
        return (
            <div
                className={styles.container}
            >

                {props.selectedField !== null && props.selectedField !== undefined ?
                    (
                        <>
                            {getField(() => null)}
                            <Button
                                styles={{marginTop: '8px'}}
                                className={styles.buttonField}
                                variant={'filled'}
                                disabled={!changed}
                                onClick={() => props.applyFilter()}>
                                <span style={{fontSize: '1.1rem'}} className="material-icons-round">done</span>
                                Aplicar
                            </Button>

                        </>
                    )
                    :
                    'Nada selecionado'
                }
            </div>
        )
    else if (props.selectedField)
        return getField(props.handleClose)
    else
        return null
}

Field.propTypes = {
    handleClose: PropTypes.func,

    applyFilter: PropTypes.func,
    keys: PropTypes.arrayOf(keyTemplate).isRequired,
    selectorOpen: PropTypes.bool,
    setSelectorOpen: PropTypes.func,
    selectedField: PropTypes.object,
    setSelectedField: PropTypes.func,

}
