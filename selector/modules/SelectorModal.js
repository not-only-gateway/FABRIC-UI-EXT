import styles from '../styles/SelectorModal.module.css'
import React, {useMemo, useState} from "react";
import PropTypes from "prop-types";
import {Button, DataRow, Modal, DataProvider, useListData} from "@f-ui/core";
import ListTabs from "../../list/ListTabs";
import {VARIANTS} from "../../list/List";
import Element from "../../list/components/Element";

export default function SelectorModal(props) {
    const [currentTab, setCurrentTab] = useState(0)
    const toRender = useMemo(() => {
        return props.hook.data.slice(currentTab * 15, currentTab * 15 + 15)
    }, [props.hook.data, currentTab])
    const visualizeKeys = useMemo(() => {
        return props.keys.filter(k => k.type !== 'image')
    }, [])

    const hook = useListData(
        visualizeKeys.filter(k => k.visible),
        props.hook.data.map(d => {
            if (props.mapKeyOnNull && !d.data[props.mapKeyOnNull.key])
                return {...d.data, [props.mapKeyOnNull.key]: props.mapKeyOnNull.value(d.data)}
            return d.data
        }), true)

    const nodes = toRender.map((e, index) => (
        <React.Fragment key={e.id + '-list-row'}>
            <Element
                setOnValidation={() => null}
                onRowClick={() => {
                    props.handleChange(e.data)
                    props.setOpen(false)
                }}
                variant={VARIANTS.EMBEDDED}
                isLast={index === props.hook.data.length - 1}
                data={e.data}
                page={currentTab}
                fetchPage={props.hook.currentPage}

                index={index + currentTab * 15}
            />
        </React.Fragment>
    ))


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
                        styles={{
                            minHeight: '45px',
                            padding: 0,
                            width: '100%',
                            borderRadius: '5px 0  0 5px',
                            background: 'var(--fabric-border-primary)'
                        }}
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
            <DataProvider.Provider value={hook}>

                <div className={styles.rows}>
                    <ListTabs
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab} hook={props.hook}
                        variant={VARIANTS.CARDS}/>
                    {props.hook.data.length === 0 ? (
                            <div className={styles.empty} title={'Nada encontrado'}>
                                <span className="material-icons-round" style={{fontSize: '70px'}}>folder</span>
                            </div>
                        ) :
                        nodes
                    }
                </div>
            </DataProvider.Provider>
        </Modal>)


}
SelectorModal.propTypes = {
    data: PropTypes.array, keys: PropTypes.array, createOption: PropTypes.bool,

    open: PropTypes.bool, setOpen: PropTypes.func,

    cleanState: PropTypes.func, value: PropTypes.object, handleChange: PropTypes.func,

    label: PropTypes.string, hook: PropTypes.object, identificationKey: PropTypes.string
}
