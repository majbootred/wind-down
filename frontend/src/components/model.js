const create = ({
  date = new Date().toISOString(),
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
