const create = ({
  name = '',
  date = undefined,
  items = [],
  color = '',
  img = undefined,
} = {}) => ({
  name,
  date,
  items,
  color,
  img,
})

exports.create = create
