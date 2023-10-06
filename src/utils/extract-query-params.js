export function extractQueryParams(query){
  console.log('query', query)
  return query.substr(1).split('&').reduce((queryParams, params) => {
    const [key, value] = params.split('=')
    queryParams[key] = value
    return queryParams
  }, {})
}