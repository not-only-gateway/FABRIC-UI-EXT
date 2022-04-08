import PropTypes from "prop-types";
import styles from './styles/Avatar.module.css'
import {useMemo} from "react";

export default function Avatar(props) {
    const size = useMemo(() => {
        switch (props.size) {

            case "big":
                return '130px'
            case "medium":
                return '65px'
            default:
                return '25px'
        }
    }, [props.size])
    return (
        <div className={styles.wrapper} data-size={props.size} style={{border: props.outlined ? 'var(--fabric-border-primary) 1px solid' : "unset"}}>
            {props.src ?
                <img
                    className={[styles.img, props.className].join(' ')}
                     style={props.styles} src={props.src}
                     alt={props.alt}/>
                :
                <span style={{fontSize: size}} className={'material-icons-round'}>account_circle</span>
            }
        </div>
    )
}
Avatar.propTypes = {
    outlined: PropTypes.bool,
    styles: PropTypes.object,
    className: PropTypes.string,

    size: PropTypes.oneOf(['small', 'medium', 'big']),
    src: PropTypes.string,
    alt: PropTypes.string.isRequired
}