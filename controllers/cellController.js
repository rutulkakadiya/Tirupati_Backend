const UserModel = require('../model/UserModel');
const cellData = require('../model/CellModel');
const XLSX = require('xlsx');

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
      data: { item: formattedCells }
    });
  } catch (error) {
    console.error('Fetching cells error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCell = async (req, res) => {
  try {
    const { row, column, value } = req.body;
    const userId = req.user.id;

    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'You do not have permission to update cells' });
    }

    // Skip storing if value is empty, null, or undefined
    if (value === null || value === undefined || value === '') {
      return res.status(400).json({ message: 'Empty cell value not stored' });
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
    res.status(500).json({ error: error.message });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    console.log('Received request for /api/cells/exportExcel'); // Debugging log
    const cells = await cellData.findAll({
      include: {
        model: UserModel,
        attributes: ['username'],
      },
      order: [['row'], ['column']],
    });
    console.log(`Found ${cells.length} cells`); // Debugging log

    // Create worksheet data
    const maxRow = cells.length > 0 ? Math.max(...cells.map(cell => cell.row)) + 1 : 1;
    const maxCol = cells.length > 0 ? Math.max(...cells.map(cell => cell.column)) + 1 : 1;

    // Create empty worksheet data
    const wsData = Array.from({ length: maxRow }, () => Array(maxCol).fill(''));

    // Fill worksheet with cell data
    cells.forEach(cell => {
      wsData[cell.row][cell.column] = cell.value || '';
    });

    // Add column headers (A, B, C, ...)
    const getColumnLabel = (index) => {
      let label = '';
      index += 1;
      while (index > 0) {
        index--;
        label = String.fromCharCode(65 + (index % 26)) + label;
        index = Math.floor(index / 26);
      }
      return label;
    };

    const headers = ['', ...Array.from({ length: maxCol }, (_, i) => getColumnLabel(i))];
    wsData.unshift(headers);

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate buffer
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Set response headers
    res.setHeader('Content-Disposition', 'attachment; filename=spreadsheet.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({ message: 'Error exporting to Excel', error: error.message });
  }
};