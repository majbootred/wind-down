const create = ({
  name = '',
  date = Date.now(),
  items = ['', '', ''],
  color = '#B58900',
  img = '',
} = {}) => ({
  name,
  date,
  items,
  color,
  img,
})

exports.create = create
