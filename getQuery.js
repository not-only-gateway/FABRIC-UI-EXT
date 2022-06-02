import Cookies from "universal-cookie/lib";
import ENV from "../env";

export default function getQuery(suffix, relations = {}, deep_relations = []) {

    return {
        url: ENV.URLS.host+ '/api/list/' + suffix,
        headers: {'authorization': (new Cookies()).get('jwt')},
        parsePackage: pack => {

            let value = {...pack}
            value.filters = typeof value.filters === 'string' ? JSON.parse(value.filters) : value.filters
            if (relations !== null && relations !== undefined && pack && pack.filters) {

                Object.keys(relations).forEach(e => {
                    value.filters.push({
                        key: e,
                        value: relations[e],
                        type: 'object'
                    })
                })
            }
            value.filters = [...value.filters, ...deep_relations]
            value.filters.forEach((e, index) => {
                if (e.type === 'object' && e.value && typeof e.value === 'object')
                    value.filters[index] = {...e, value: e.value.id}
                else
                    value.filters[index] = {...e, value: e.value}
            })

            return value
        },
        fetchSize: 15
    }
}
