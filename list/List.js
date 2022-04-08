import PropTypes from 'prop-types'
import styles from './styles/List.module.css'
import Header from "./components/Header";
import React, {useState} from "react";
import keyTemplate from "./templates/keyTemplate";
import useList from "./hook/useList";
import Settings from "./components/Settings";
import {DataProvider, useInfiniteScroll, useListData} from '@f-ui/core'
import Element from "./components/Element";
import Validate from "./components/Validate";

export default function List(props) {
    const {keys, keysDispatcher, actions, setOpenSettings, openSettings} = useList(props.keys)
    console.log(keys, props.keys)
    const lastElementRef = useInfiniteScroll(props.hook.setCurrentPage, props.hook.currentPage, props.hook.loading, props.hook.hasMore)
    const [scrolled, setScrolled] = useState(false)
    const [selfContained, setSelfContained] = useState(true)
    const hook = useListData(keys.filter(k => k.visible), props.hook.data.map(d => d.data), selfContained)
    const [onValidation, setOnValidation] = useState({})
    return (
        <DataProvider.Provider value={hook}>
            <div
                onScroll={event => {
                    if (event.target.scrollTop > 0)
                        setScrolled(true)
                    else
                        setScrolled(false)
                }}
                className={styles.container}
            >
                <Validate onValidation={onValidation} setOnValidation={setOnValidation} keys={keys}/>
                <Settings
                    open={openSettings}
                    keys={keys} actions={actions} setOpen={setOpenSettings}
                    dispatchKeys={keysDispatcher}/>
                <Header
                    scrolled={scrolled}
                    setSelfContained={setSelfContained}
                    selfContained={selfContained}
                    title={props.title}
                    noFilters={props.noFilters}
                    createOption={props.createOption}
                    onCreate={props.onCreate}
                    hook={props.hook}
                    keys={keys} actions={actions} dispatch={keysDispatcher}
                    setOpenSettings={setOpenSettings}
                />
                <div
                    className={styles.tableWrapper}
                >
                    {props.hook.data.length === 0 ?
                        <div className={styles.empty}>
                            <span className={'material-icons-round'} style={{fontSize: '75px'}}>folder</span>
                            Nada encontrado
                        </div>
                        :
                        null
                    }

                    {props.hook.data.map((e, index) => (
                        <React.Fragment key={e.id + '-list-row'}>
                            <Element setOnValidation={setOnValidation} onRowClick={props.onRowClick} isLast={index === props.hook.data.length -1 } data={e.data} options={props.options} index={index} lastElementRef={lastElementRef}/>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </DataProvider.Provider>
    )
}

List.propTypes = {
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
