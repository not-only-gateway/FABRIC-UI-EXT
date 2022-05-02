import styles from "../wrapper/styles/Profile.module.css";
import {Avatar} from "@f-ui/query";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import {useRef} from "react";
import PropTypes from "prop-types";

export default function AvatarInput(props){
    const ref = useRef()
    return (
        <>
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
                           props.handleChange(canvas.toDataURL())
                       }
                       ref.current.value = ''
                   }}
            />


            <div className={styles.avatar}>
                <Avatar alt={props.label} size={'big'}
                        src={props.value}/>
                <Dropdown className={styles.uploadButton} variant={'outlined'}>
                    <DropdownOptions>
                        <DropdownOption option={{
                            label: 'Editar',
                            icon: <span className={'material-icons-round'}
                                        style={{fontSize: '1.1rem'}}>edit</span>,
                            onClick: () => ref.current.click()
                        }}/>
                        <DropdownOption option={{
                            label: 'Remover',
                            icon: <span className={'material-icons-round'}
                                        style={{fontSize: '1.1rem'}}>clear</span>,
                            onClick: () => {
                                props.handleChange('')
                            }
                        }}/>
                    </DropdownOptions>
                </Dropdown>
            </div>
        </>
    )
}

AvatarInput.propTypes={
    required: PropTypes.bool,
    handleChange: PropTypes.func,
    value: PropTypes.any,
    label: PropTypes.string
}