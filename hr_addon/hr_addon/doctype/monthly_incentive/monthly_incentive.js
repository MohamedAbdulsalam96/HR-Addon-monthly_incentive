// Copyright (c) 2022, Raaj Tailor and contributors
// For license information, please see license.txt

frappe.ui.form.on('Monthly Incentive', {
	refresh: function(frm) {
		cur_frm.add_custom_button(__("Get Employees"), function() {
			frm.trigger("get_employee");
		}).toggleClass('btn-primary', !(frm.doc.component || []).length);
	},
	
	start_date: function (frm) {
		// frm.trigger("reset");
		if(frm.doc.start_date){
			
			frm.trigger("set_end_date");
			frm.set_value("employee_absent",[])
			frm.refresh_field("employee_absent")
		}
	},
	set_end_date: function(frm){
		frappe.call({
			method: 'erpnext.payroll.doctype.payroll_entry.payroll_entry.get_end_date',
			args: {
				frequency: "Monthly",
				start_date: frm.doc.start_date
			},
			callback: function (r) {
				if (r.message) {
					frm.set_value('end_date', r.message.end_date);
				}
			}
		});
	},
	get_employee:function(frm){
		if(frm.doc.start_date && frm.doc.end_date){
			frm.set_value("employee_absent",[])
			frm.refresh_field("employee_absent")
			return frappe.call({
				doc: frm.doc,
				method: 'fill_employee',
				callback: function(r) {
					if (r.docs[0].employee_absent){
						// frm.save();
						frm.save();
					}
					
					// }
				}
			})
		}else{
			frappe.throw("Please select Start and End Date First!")
		}
		
	}
});

