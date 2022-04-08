import PropTypes from "prop-types";
import styles from '../styles/Profile.module.css'
import {Button, Dropdown, DropdownOption, DropdownOptions, Tab, Tabs, ToolTip} from "@f-ui/core";
import {useRef, useState} from "react";
import useRequest from "../../hooks/useRequest";
import Cookies from "universal-cookie/lib";
import FormTemplate from "../../FormTemplate";
import Avatar from "../../avatar/Avatar";

const cookies = new Cookies()
export default function Profile(props) {
    const {profileData} = props
    const [open, setOpen] = useState(0)
    const {make} = useRequest(true)
    const ref = useRef()
    return (
        <div className={styles.wrapper}>
            <input type="file" style={{display: 'none'}}
                   accept={['image/png', 'image/jpeg', 'jpg']}
                   multiple={false} ref={ref}
                   onChange={event => {

                       const img = new Image()
                       img.src = URL.createObjectURL(event.target.files[0])
                       img.onload = () => {
                           const canvas = document.createElement('canvas')
                           canvas.width = img.naturalWidth
                           canvas.height = img.naturalHeight

                           const ctx = canvas.getContext('2d')
                           ctx.drawImage(img, 0, 0)
                           make({
                               url: props.host + '/api/user/' + profileData.user_email,
                               method: 'PUT',
                               data: {...profileData, pic: canvas.toDataURL()}
                           })
                               .then(() => props.refreshProfile())
                               .catch()
                       }
                       ref.current.value = ''
                   }}
            />
            <div className={styles.header}>
                <Button
                    className={styles.returnButton}
                    variant={'filled'}
                    onClick={() => props.handleClose()}>
                    <span className={'material-icons-round'}>chevron_left</span>
                    <ToolTip content={'Retornar'}/>
                </Button>
                <div className={styles.avatar}>
                    <Avatar
                        outlined={true}
                        alt={'Img'} src={profileData.pic} size={"big"}
                    />
                    <Dropdown className={styles.uploadButton} variant={'outlined'}>
                        <DropdownOptions>
                            <DropdownOption option={{
                                label: 'Editar',
                                icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>edit</span>,
                                onClick: () => ref.current.click()
                            }}/>
                            <DropdownOption option={{
                                label: 'Remover',
                                icon: <span className={'material-icons-round'}
                                            style={{fontSize: '1.1rem'}}>clear</span>,
                                onClick: () => {
                                    make({
                                        url: props.host + '/api/user/' + profileData.user_email,
                                        method: 'PUT',
                                        data: {...profileData, pic: ''}
                                    }).then(() => props.refreshProfile())
                                        .catch()
                                }
                            }}/>
                        </DropdownOptions>
                    </Dropdown>
                </div>

                {profileData.name}
                <div className={styles.emailWrapper}>
                    {profileData.user_email}
                </div>

            </div>
            <Tabs open={open} setOpen={setOpen} headerStyles={{justifyContent: 'center'}}>
                <Tab label={'Sobre você'} className={styles.tab}>
                    <FormTemplate
                        title={profileData.name}
                        obj={[{
                            title: 'Sobre você',
                            groups: '2 1',
                            rowGap: '4px',
                            columnGap: '16px',
                            inputs: [

                                {
                                    label: 'Nome',
                                    placeHolder: 'Nome',
                                    required: true,
                                    disabled: false,
                                    key: 'name',

                                    type: 'text',
                                    width: '100%',
                                },

                                {
                                    label: 'Email',
                                    placeHolder: 'Email',

                                    disabled: true,
                                    key: 'user_email',
                                    type: 'text',
                                    width: '100%',
                                },
                                {
                                    label: 'Sobre',
                                    placeHolder: 'Sobre',

                                    disabled: false,
                                    key: 'about',
                                    customProps: {
                                        variant: 'area'
                                    },
                                    type: 'text',
                                    width: '100%',
                                }
                            ]
                        }]}
                        initial={profileData}
                        submit={(data) => {

                            make({
                                url: props.host + '/api/user/' + profileData.user_email,
                                method: 'PUT',
                                data: data
                            }).then(() => props.refreshProfile())
                                .catch()

                        }}/>
                </Tab>
                <Tab label={'Notificações'} disabled={true} className={styles.tab}>

                </Tab>
                <Tab label={'Histórico de sessão'} className={styles.tab} disabled={true}>

                </Tab>
                <Tab label={'Preferências'} className={styles.tab} disabled={true}>

                </Tab>
            </Tabs>
        </div>
    )
}

Profile.propTypes = {
    refreshProfile: PropTypes.func,
    handleClose: PropTypes.func,
    profileData: PropTypes.object,
    host: PropTypes.string,
    updateTheme: PropTypes.func
}