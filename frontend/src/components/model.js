let today = new Date().toISOString()
let short = today.substr(0, 10)
today = `${short}T00:00:00.000Z`

const create = ({
  date = today,
  items = ['', '', ''],
  color = '#B58900',
  img = '',
} = {}) => ({
  date,
  items,
  color,
  img,
})

exports.create = create
