import styles from '../styles/SelectorModal.module.css'
import React from "react";
import PropTypes from "prop-types";
import {Button, DataRow, Modal, useInfiniteScroll} from "@f-ui/core";

export default function SelectorModal(props) {
    const lastElementRef = useInfiniteScroll(props.hook.setCurrentPage, props.hook.currentPage, props.hook.loading, props.hook.hasMore)


    return (
        <Modal
            open={props.open}
            handleClose={() => {
                props.setOpen(false)
                if (props.handleClose)
                    props.handleClose()
            }}
            blurIntensity={'1px'}
            className={styles.wrapper}
        >

            <div className={styles.headerButtons}>
                <div className={styles.header}>
                    {props.label}
                </div>

                <Button
                    variant={'outlined'}
                    onClick={() => props.hook.clean()}
                    className={styles.headerButton}
                    styles={{marginRight: '4px'}}
                    attributes={{
                        title: 'Recarregar dados'
                    }}
                >
                    <span className="material-icons-round" style={{fontSize: '1.1rem'}}>refresh</span>
                </Button>


            </div>

            <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
                {props.value && Object.keys(props.value).length > 0 ? <DataRow
                    onClick={() => {
                        if (props.onClick) props.onClick()

                    }}
                    keys={props.keys} object={props.value}
                    styles={{minHeight: '45px', padding: 0, width: '100%', borderRadius: '5px 0  0 5px',background: 'var(--fabric-border-primary)'}}
                    selfContained={true}
                /> : <DataRow
                    onClick={() => {
                        if (props.onClick) props.onClick()

                    }}
                    styles={{
                        minHeight: '35px',
                        padding: '4px',
                        width: '100%',
                        background: 'var(--fabric-border-primary)'
                    }}
                    keys={[{label: 'Vazio', type: 'string', key: 'k'}]}
                    object={{k: 'Nada selecionado'}}
                    selfContained={false}
                />}
                <Button
                    variant={'outlined'}
                    onClick={() => {
                        props.handleChange(null)
                        props.setOpen(false)
                    }}
                    styles={{
                        '--fabric-accent-color': '#ff5555',
                        height: '100%',
                        borderRadius: '0 5px 5px 0  ',
                        borderLeftColor: 'var(--fabric-background-tertiary)',
                        display: props.value && Object.keys(props.value).length > 0 ? undefined : 'none'
                    }}
                    className={styles.headerButton}
                    disabled={!props.value}
                    attributes={{
                        title: 'Limpar selecionado'
                    }}>
                    <span className="material-icons-round" style={{fontSize: '1.1rem'}}>clear</span>
                </Button>
            </div>
            <div className={styles.rows}>
                {props.hook.data.length === 0 ?(
                    <div className={styles.empty} title={'Nada encontrado'}>
                        <span className="material-icons-round" style={{fontSize: '70px'}}>folder</span>
                    </div>
                ) :
                    props.hook.data.map((e, index) => (
                    <React.Fragment key={e.id + '-selector-modal-row-' + index}>
                        <DataRow
                            styles={{
                                minHeight: '50px',
                                background: index % 2 === 0 ? 'var(--fabric-background-tertiary)' : undefined,
                                borderRadius: index === 0 ? '5px 5px 0 0' : index === props.hook.data.length - 1 ? '0 0 5px 5px' : 0
                            }}
                            className={styles.row}
                            onClick={() => {
                                props.handleChange(e.data)
                                props.setOpen(false)
                            }}
                            reference={index === (props.hook.data.length - 1) ? lastElementRef : undefined}
                            keys={props.keys} object={e.data} selfContained={true}
                        />
                    </React.Fragment>))}
            </div>
        </Modal>)


}
SelectorModal.propTypes = {
    data: PropTypes.array, keys: PropTypes.array, createOption: PropTypes.bool,

    open: PropTypes.bool, setOpen: PropTypes.func,

    cleanState: PropTypes.func, value: PropTypes.object, handleChange: PropTypes.func,

    label: PropTypes.string, hook: PropTypes.object, identificationKey: PropTypes.string
}
