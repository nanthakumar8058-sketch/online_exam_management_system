const express = require('express');
const { getDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartmentDetails } = require('../controllers/departments');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('org_admin', 'staff'), getDepartments)
  .post(authorize('org_admin'), createDepartment);

router.route('/:id')
  .put(authorize('org_admin'), updateDepartment)
  .delete(authorize('org_admin'), deleteDepartment);

router.route('/:id/details')
  .get(authorize('org_admin', 'staff'), getDepartmentDetails);

module.exports = router;
