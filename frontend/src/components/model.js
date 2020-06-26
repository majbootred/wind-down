const create = ({
  name = '',
  date = Date.now(),
  items = ['', '', ''],
  color = '#1d2326',
  img = '',
} = {}) => ({
  name,
  date,
  items,
  color,
  img,
})

exports.create = create
