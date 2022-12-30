# Copyright (c) 2022, Raaj Tailor and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document

class MonthlyIncentive(Document):
	def validate(self):
		for comp in self.employee_absent:
			self.create_component(comp.employee,comp.incentive,"Incentive")

	@frappe.whitelist()
	def fill_employee(self):
		self.set('employee_absent', [])
		
		employees = frappe.db.sql("""select distinct t1.name  as employee
		from `tabEmployee` t1, 
		`tabSalary Structure Assignment` t2 where t1.name = t2.employee""", as_dict=True)

		if not employees:
			frappe.throw(_("No employees for the mentioned criteria"))

		for d in employees:
			self.append('employee_absent', d)

	def create_component(self,employee,value,component):
		if value > 0 and not frappe.db.get_value('Additional Salary',{'employee':employee,'salary_component':component,
		'payroll_date':self.start_date},'name'):
		
			company = frappe.db.get_value('Employee', employee, 'company')
			additional_salary = frappe.new_doc('Additional Salary')
			additional_salary.employee = employee
			additional_salary.salary_component = component
			additional_salary.amount = value
			additional_salary.payroll_date = self.start_date
			additional_salary.company = company
			additional_salary.submit()
			frappe.msgprint("Salary Component created for "+employee)
