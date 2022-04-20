import PropTypes from "prop-types";
import {EmbeddedForm, useFormData} from "@f-ui/core";
import Selector from './selector/Selector'
import AvatarInput from "./avatar/AvatarInput";

export default function FormTemplate(props) {
    const hook = useFormData(props.initial)

    return (<EmbeddedForm
        title={props.title}
        create={props.create}
        handleClose={props.handleClose}
        returnButton={props.handleClose !== undefined}
        sections={props.obj.map(obj => {
            return {
                ...obj, inputs: obj.inputs.map(o => {

                    if (o.query) return {
                        type: 'custom',
                        children: (<Selector
                            value={hook.data[o.key]}
                            handleChange={(obj) => {
                                hook.handleChange({
                                    event: obj, key: o.key
                                })
                            }}

                            label={o.label}
                            required={o.required}
                            disabled={o.disabled}
                            placeholder={o.placeHolder}
                            keys={o.keys}
                            query={o.query}
                            width={o.width}
                            height={o.height}
                        />)
                    }
                    if (o.type === 'image') {
                        return {
                            type: "custom",
                            children: (
                                <AvatarInput
                                    label={o.label}
                                    required={o.required}
                                    handleChange={(img) => {
                                        hook.handleChange({
                                            event: img, key: o.key
                                        })
                                    }}
                                    value={hook.data[o.key]}
                                />
                            )
                        }
                    }
                    return o
                })
            }
        })}
        hook={hook}
        handleSubmit={props.submit}
    />)
}

FormTemplate.propTypes = {
    create: PropTypes.bool,
    handleClose: PropTypes.func,
    initial: PropTypes.object,
    obj: PropTypes.array,
    submit: PropTypes.func
}