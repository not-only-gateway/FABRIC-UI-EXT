import PropTypes from 'prop-types'
import styles from './styles/List.module.css'
import Header from "./components/Header";
import React, {useMemo, useState} from "react";
import keyTemplate from "./templates/keyTemplate";
import useList from "./hook/useList";
import Settings from "./components/Settings";
import {DataProvider, Masonry, useInfiniteScroll, useListData} from '@f-ui/core'
import Element from "./components/Element";
import Validate from "./components/Validate";
import ListTabs from "./ListTabs";

export const VARIANTS = {
    EMBEDDED: 0,
    MINIMAL: 1,
    CARDS: 2
}
export default function List(props) {
    const {keys, keysDispatcher, actions, setOpenSettings, openSettings} = useList(props.keys)

    const lastElementRef = useInfiniteScroll(props.hook.setCurrentPage, props.hook.currentPage, props.hook.loading, props.hook.hasMore)
    const [variant, setVariant] = useState(VARIANTS.EMBEDDED)
    const visualizeKeys = useMemo(() => {
        return keys.filter(k => k.type !== 'image' && variant !== VARIANTS.CARDS || variant === VARIANTS.CARDS)
    }, [variant])

    const hook = useListData(visualizeKeys.filter(k => k.visible), props.hook.data.map(d => {
        if (props.mapKeyOnNull && !d.data[props.mapKeyOnNull.key])
            return {...d.data, [props.mapKeyOnNull.key]: props.mapKeyOnNull.value(d.data)}
        return d.data
    }), variant !== VARIANTS.MINIMAL)
    const [onValidation, setOnValidation] = useState({})
    const [currentTab, setCurrentTab] = useState(0)

    const toRender = useMemo(() => {
        if (variant === VARIANTS.CARDS) {

            return props.hook.data.slice(currentTab * 15, currentTab * 15 + 15)
        } else
            return props.hook.data
    }, [props.hook.data, variant, currentTab])

    const nodes = toRender.map((e, index) => (
        <React.Fragment key={e.id + '-list-row'}>
            <Element
                setOnValidation={setOnValidation}
                onRowClick={props.onRowClick}
                variant={variant}
                isLast={index === props.hook.data.length - 1}
                data={e.data}
                page={currentTab}
                fetchPage={props.hook.currentPage}
                options={props.options}
                index={index + (variant === VARIANTS.CARDS ? currentTab * 15 : 0)}
                lastElementRef={variant !== VARIANTS.CARDS && index === props.hook.data.length - 1 ? lastElementRef : undefined}
            />
        </React.Fragment>
    ))

    return (
        <DataProvider.Provider value={hook}>
            <div className={styles.container}>
                <Validate onValidation={onValidation} setOnValidation={setOnValidation} keys={keys}/>
                <Settings
                    open={openSettings}

                    keys={visualizeKeys} actions={actions} setOpen={setOpenSettings}
                    dispatchKeys={keysDispatcher}/>
                <Header
                    hasCardView={props.hasCardView}

                    title={props.title}
                    variant={variant} setVariant={setVariant}
                    noFilters={props.noFilters}
                    createOption={props.createOption}
                    onCreate={props.onCreate}
                    hook={props.hook}
                    keys={visualizeKeys} actions={actions} dispatch={keysDispatcher}
                    setOpenSettings={setOpenSettings}
                />
                <div
                    className={styles.tableWrapper}
                >
                    <ListTabs currentTab={currentTab} setCurrentTab={setCurrentTab} hook={props.hook}
                              variant={variant}/>
                    {props.hook.data.length === 0 ?
                        <div className={styles.empty}>
                            <span className={'material-icons-round'} style={{fontSize: '75px'}}>folder</span>
                            Nada encontrado
                        </div>
                        :
                        null
                    }
                    {variant === VARIANTS.CARDS ?
                        <Masonry changeListener={toRender}>
                            {nodes}
                        </Masonry>
                        :
                        nodes
                    }
                </div>
            </div>
        </DataProvider.Provider>
    )
}

List.propTypes = {
    mapKeyOnNull: PropTypes.shape({key: PropTypes.string, value: PropTypes.func}),
    hasCardView: PropTypes.bool,
    children: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func,
        icon: PropTypes.any
    })),

    noFilters: PropTypes.bool,
    hook: PropTypes.object.isRequired,
    onRowClick: PropTypes.func.isRequired,
    keys: PropTypes.arrayOf(keyTemplate).isRequired,
    controlButtons: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.element,
        label: PropTypes.any,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
        validadeChoice: PropTypes.bool,
        validationMessage: PropTypes.string
    })),
    title: PropTypes.any,

    createOption: PropTypes.bool,
    onCreate: PropTypes.func,
    onlyVisualization: PropTypes.bool
}
