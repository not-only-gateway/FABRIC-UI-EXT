import PropTypes from "prop-types";
import React from "react";

export default PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.oneOf(['string', 'number', 'object', 'date', 'bool', 'array', 'image']),
    getColor: PropTypes.func,
    subfieldKey: PropTypes.string,
    visible: PropTypes.bool,
    maskStart: PropTypes.any,
    maskEnd: PropTypes.any,
    additionalWidth: PropTypes.string,
    subType:  PropTypes.oneOf(['string', 'number', 'object', 'date', 'bool']),
    deeperFieldKey: PropTypes.string,
    deeperFieldType:  PropTypes.oneOf(['string', 'number', 'date', 'bool']),
    hoursOffset: PropTypes.number
})
