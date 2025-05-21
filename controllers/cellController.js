const UserModel  = require('../model/UserModel');
const cellData = require('../model/CellModel');

exports.getCells = async (req, res) => {
  try {
    const cells = await cellData.findAll({
      include: {
        model: UserModel,
        attributes: ['username'],
      },
      order: [['row'], ['column']],
    });

    const formattedCells = cells.map(c => ({
      row: c.row,
      column: c.column,
      value: c.value,
      lastModifiedBy: c.User?.username,
      lastModifiedAt: c.updated_at,
    }));

    res.status(200).json({
      data: {item: formattedCells}
    });
  } catch (error) {
    console.error('Fetching cells error:', error);
    res.status(500).json({ error });
  }
};

exports.updateCell = async (req, res) => {
  try {
    const { row, column, value } = req.body;
    const userId = req.user.id;

    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'You do not have permission to update cells' });
    }

    await cellData.upsert({
      row,
      column,
      value,
      last_modified_by: userId,
    });

    res.json({ message: 'Cell updated successfully' });
  } catch (error) {
    console.error('Updating cell error:', error);
    res.status(500).json({ error});
  }
};
