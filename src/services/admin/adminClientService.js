const { pool } = require("../../config/config");

const adminFetchAllClientDetailsService = async () => {
    let connection;
    try {
        connection = await pool.getConnection();

        const [rows] = await connection.execute(`
            SELECT cd.id,
    cd.ClientTypeId,
    MAX(ct.client_type) AS client_type,  -- Use MAX() to pick one value
    cd.DistributionId,
    MAX(td.DistributionType) AS DistributionType,
    cd.NameOfShop,
    cd.OwnerName,
    cd.VillageName,
    cd.PhoneNumber1,
    cd.PhoneNumber2,
    cd.DOB,
    cd.MaritalStatus,
    cd.MarriageAnniversary,
    cd.Address_C,
    cd.NearBy,
    cd.Pin,
    cd.MedicalDetail,
    cd.MineralForWater,
    cd.VitMineralForFeed,
    cd.Vitamin_C,
    cd.OxygenSuppliment,
    cd.Probiotic_Soil_Water,
    cd.Probiotic_Feed,
    cd.NameOfFarmer,
    cd.AreaOfCulture,
    cd.No_of_Pond,
    cd.Agent_CheckBox,
    cd.Sub_Agent_CheckBox,
    cd.Retailer_CheckBox,
    cd.AgentName,
    cd.SubAgentName,
    cd.RetailerName,
    cd.CreatedAt,
    cd.route_id,
    MAX(trn.route_name) AS route_name,
    cd.sub_route_name,
    COALESCE(MAX(tvn.village_name), '') AS route_village_name,
    MAX(e.region_id) AS region_id,
    MAX(tr.region) AS region,
    MAX(e.emp_name) AS employee_name,
    MAX(e.id) AS employee_id,
    MAX(e.AbmArea_id) AS AbmArea_id,
    MAX(a.AbmArea) AS AbmArea,
    MAX(e_abm.emp_name) AS abm_emp_name,
    MAX(e_abm.id) AS abm_id,
    MAX(e_filtered.emp_name) AS region_emp_name,
    MAX(e_filtered.id) AS rbm_id,
    cd.FieldTechnicianId,
    MAX(e.FieldTechnicianHq_id) AS FieldTechnicianHq_id,
    MAX(tft.FieldTechnicianHq) AS FieldTechnicianHq,
    MAX(e_self.emp_name) AS FieldTechnician_emp_name
FROM tbl_client_details cd
LEFT JOIN tbl_client_type ct ON cd.ClientTypeId = ct.id
LEFT JOIN tbl_distribution td ON cd.DistributionId = td.id
LEFT JOIN tbl_route trn ON cd.route_id = trn.id
LEFT JOIN tbl_village_name tvn ON cd.sub_route_name = tvn.id
LEFT JOIN tbl_employees e ON cd.FieldTechnicianId = e.id AND cd.hq_id = e.FieldTechnicianHq_id
LEFT JOIN tbl_field_technician tft ON e.FieldTechnicianHq_id = tft.id
LEFT JOIN tbl_region tr ON e.region_id = tr.id
LEFT JOIN tbl_abm_area a ON e.AbmArea_id = a.id
LEFT JOIN tbl_employees e_filtered ON e.region_id = e_filtered.region_id 
    AND (e_filtered.AbmArea_id IS NULL OR e_filtered.AbmArea_id = '') 
    AND (e_filtered.FieldTechnicianHq_id IS NULL OR e_filtered.FieldTechnicianHq_id = '')
LEFT JOIN tbl_employees e_abm ON e.region_id = e_abm.region_id 
    AND e.AbmArea_id = e_abm.AbmArea_id 
    AND (e_abm.FieldTechnicianHq_id IS NULL OR e_abm.FieldTechnicianHq_id = '')
LEFT JOIN tbl_employees e_self ON e.region_id = e_self.region_id 
    AND e.AbmArea_id = e_self.AbmArea_id 
    AND e.FieldTechnicianHq_id = e_self.FieldTechnicianHq_id
GROUP BY cd.id;

        `);

        return { success: true, status: 200, client_details: rows };
    } catch (error) {
        console.error("Database Error:", error.message);
        return { success: false, status: 400, message: error.message };
    } finally {
        if (connection) connection.release();
    }
};


module.exports = { adminFetchAllClientDetailsService };