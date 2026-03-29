const Department = require('../models/Department');

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ organization: req.user.organization }).sort({ name: 1 });
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.createDepartment = async (req, res, next) => {
  try {
    req.body.organization = req.user.organization; 
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    let department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ success: false, error: 'Not found' });
    if (department.organization.toString() !== req.user.organization.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: department });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ success: false, error: 'Not found' });
    if (department.organization.toString() !== req.user.organization.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    await department.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
