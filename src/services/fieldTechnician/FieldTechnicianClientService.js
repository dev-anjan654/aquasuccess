const {pool} = require("../../config/config");

// Fetch Distribution Types
async function fieldTechnicianDistributionFetchService() {
    let conn;
    return pool.getConnection()
        .then(connection => {
            conn = connection;
            const query = "SELECT id, DistributionType FROM tbl_distribution ORDER BY id DESC";
            return conn.execute(query);
        })
        .then(([rows]) => {
            const distributions = rows.map(row => ({
                id: row.id,
                distributionType: row.DistributionType
            }));
            conn.release();  // Release the connection back to the pool
            return { success: true, distributions };
        })
        .catch(error => {
            if (conn) conn.release();
            return { success: false, message: error.message };
        });
}



async function fieldTechnicianClientDetailsInsertService(data) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        const {
            client_distribution_id,
            client_client_type_id,
            client_name_of_shop,
            client_owner_name,
            client_village_name,
            client_phone_number1,
            client_phone_number2,
            client_dob,
            client_marital_status,
            client_marriage_anniversary,
            client_address,
            client_near_by,
            client_pin,
            client_medical_detail,
            client_mineral_for_water,
            client_vit_mineral_for_feed,
            client_vitamin_c,
            client_oxygen_suppliment,
            client_probiotic_soil_water,
            client_probiotic_feed,
            client_name_of_farmer,
            client_area_of_culture,
            client_no_of_pond,
            client_agent_checkbox = 0,
            client_sub_agent_checkbox = 0,
            client_retailer_checkbox = 0,
            client_agent_name,
            client_sub_agent_name,
            client_retailer_name,
            client_route_id,
            client_sub_route_name,
            field_technician_id,
            hq_id
        } = data;

        if (client_marital_status === "Married" && !client_marriage_anniversary) {
            return { success: false, message: "Marriage Anniversary is required." };
        }

        if ((client_agent_checkbox || client_sub_agent_checkbox || client_retailer_checkbox) &&
            (!client_agent_name || !client_sub_agent_name || !client_retailer_name)) {
            return { success: false, message: "Agent, Sub-Agent, and Retailer names are required." };
        }

        if (!client_route_id || !client_sub_route_name) {
            return { success: false, message: "Please Select Route and Village." };
        }

        if (!field_technician_id || !hq_id) {
            return { success: false, message: "Field Technician ID and HQ ID are required." };
        }

        const convertEmpty = (value) => (value === undefined || value === "" ? null : value);

        const sql = `
            INSERT INTO tbl_client_details (
                ClientTypeId, DistributionId, NameOfShop, OwnerName, VillageName, PhoneNumber1, PhoneNumber2,
                DOB, MaritalStatus, MarriageAnniversary, Address_C, NearBy, Pin, MedicalDetail, MineralForWater,
                VitMineralForFeed, Vitamin_C, OxygenSuppliment, Probiotic_Soil_Water, Probiotic_Feed,
                NameOfFarmer, AreaOfCulture, No_of_Pond, Agent_CheckBox, Sub_Agent_CheckBox, Retailer_CheckBox,
                AgentName, SubAgentName, RetailerName, route_id, sub_route_name, FieldTechnicianId, hq_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await conn.execute(sql, [
            convertEmpty(client_client_type_id), convertEmpty(client_distribution_id), convertEmpty(client_name_of_shop), convertEmpty(client_owner_name),
            convertEmpty(client_village_name), convertEmpty(client_phone_number1), convertEmpty(client_phone_number2), convertEmpty(client_dob),
            convertEmpty(client_marital_status), convertEmpty(client_marriage_anniversary), convertEmpty(client_address), convertEmpty(client_near_by),
            convertEmpty(client_pin), convertEmpty(client_medical_detail), convertEmpty(client_mineral_for_water), convertEmpty(client_vit_mineral_for_feed),
            convertEmpty(client_vitamin_c), convertEmpty(client_oxygen_suppliment), convertEmpty(client_probiotic_soil_water), convertEmpty(client_probiotic_feed),
            convertEmpty(client_name_of_farmer), convertEmpty(client_area_of_culture), convertEmpty(client_no_of_pond), client_agent_checkbox,
            client_sub_agent_checkbox, client_retailer_checkbox, convertEmpty(client_agent_name), convertEmpty(client_sub_agent_name),
            convertEmpty(client_retailer_name), convertEmpty(client_route_id), convertEmpty(client_sub_route_name), convertEmpty(field_technician_id),
            convertEmpty(hq_id)
        ]);

        await conn.commit();
        return { success: true, message: "Client details inserted successfully." };
    } catch (error) {
        if (conn) await conn.rollback();
        return { success: false, message: `Database Error: ${error.message}` };
    } finally {
        if (conn) conn.release();
    }
}

// Fetch client types
const fetchFieldTechnicianClientTypesService = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        const [rows] = await conn.execute("SELECT id, client_type FROM tbl_client_type ORDER BY id DESC");

        const clientTypes = rows.map(row => ({
            id: row.id,
            client_type: row.client_type
        }));

        return { success: true, client_types: clientTypes };
    } catch (error) {
        console.error("Error fetching client types:", error);
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
};
// ********
// something problem 
// Fetch client details by route
const fetchFieldTechnicianClientDetailsByRouteService = async (route_id, sub_route_id, field_technician_id, hq_id) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // SQL query replacing the stored procedure logic
        const query = `
            SELECT cd.id,
                   ct.client_type,
                   d.DistributionType,
                   cd.NameOfShop,
                   cd.OwnerName,
                   cd.NameOfFarmer
            FROM tbl_client_details cd
            INNER JOIN tbl_client_type ct ON cd.ClientTypeId = ct.id
            INNER JOIN tbl_distribution d ON cd.DistributionId = d.id
            WHERE 
                (? IS NULL OR cd.route_id = ?) AND
                (? IS NULL OR cd.sub_route_id = ?) AND
                (? IS NULL OR cd.FieldTechnicianId = ?) AND
                (? IS NULL OR cd.hq_id = ?)
        `;

        // Execute the query with parameters
        const [rows] = await conn.execute(query, [route_id, route_id, sub_route_id, sub_route_id, field_technician_id, field_technician_id, hq_id, hq_id]);

        // Map response
        const clients = rows.map(row => ({
            id: row.id,
            client_type: row.client_type,
            distribution_type: row.DistributionType,
            name_of_shop: row.NameOfShop,
            owner_name: row.OwnerName,
            farmer_name: row.NameOfFarmer
        }));

        return { success: true, clients };
    } catch (error) {
        console.error("Error fetching client details by route:", error);
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
};


async function fieldTechnicianClientDetailsUpdateService(clientId, data) {
    let conn;
    try {
        conn = await pool.getConnection();

        // Check if client exists
        const [rows] = await conn.execute("SELECT 1 FROM tbl_client_details WHERE id = ?", [clientId]);
        if (rows.length === 0) {
            return { success: false, message: "Client ID does not exist. Update failed." };
        }

        // Extract fields with default values
        const {
            client_distribution_id = null,
            client_client_type_id = null,
            client_name_of_shop = null,
            client_owner_name = null,
            client_village_name = null,
            client_phone_number1 = null,
            client_phone_number2 = null,
            client_dob = null,
            client_marital_status = null,
            client_marriage_anniversary = null,
            client_address = null,
            client_near_by = null,
            client_pin = null,
            client_medical_detail = null,
            client_mineral_for_water = null,
            client_vit_mineral_for_feed = null,
            client_vitamin_c = null,
            client_oxygen_suppliment = null,
            client_probiotic_soil_water = null,
            client_probiotic_feed = null,
            client_name_of_farmer = null,
            client_area_of_culture = null,
            client_no_of_pond = null,
            client_agent_checkbox = 0,
            client_sub_agent_checkbox = 0,
            client_retailer_checkbox = 0,
            client_agent_name = null,
            client_sub_agent_name = null,
            client_retailer_name = null,
            client_route_id = null,
            client_sub_route_name = null,
            field_technician_id = null,
            hq_id = null
        } = data;

        // Validation
        if (client_marital_status === "Married" && !client_marriage_anniversary) {
            return { success: false, message: "Marriage Anniversary is required." };
        }

        if ((client_agent_checkbox || client_sub_agent_checkbox || client_retailer_checkbox) &&
            (!client_agent_name || !client_sub_agent_name || !client_retailer_name)) {
            return { success: false, message: "Agent, Sub-Agent, and Retailer names are required." };
        }

        if (!client_route_id || !client_sub_route_name) {
            return { success: false, message: "Please select Route and Village." };
        }

        if (!field_technician_id || !hq_id) {
            return { success: false, message: "Field Technician ID and HQ ID are required." };
        }

        // Update query
        const updateQuery = `
            UPDATE tbl_client_details
            SET ClientTypeId = ?, DistributionId = ?, NameOfShop = ?, OwnerName = ?, VillageName = ?, PhoneNumber1 = ?, PhoneNumber2 = ?,
                DOB = ?, MaritalStatus = ?, MarriageAnniversary = ?, Address_C = ?, NearBy = ?, Pin = ?, MedicalDetail = ?, MineralForWater = ?,
                VitMineralForFeed = ?, Vitamin_C = ?, OxygenSuppliment = ?, Probiotic_Soil_Water = ?, Probiotic_Feed = ?,
                NameOfFarmer = ?, AreaOfCulture = ?, No_of_Pond = ?, Agent_CheckBox = ?, Sub_Agent_CheckBox = ?, Retailer_CheckBox = ?,
                AgentName = ?, SubAgentName = ?, RetailerName = ?, route_id = ?, sub_route_name = ?, FieldTechnicianId = ?, hq_id = ?
            WHERE id = ?`;

        const values = [
            client_client_type_id, client_distribution_id, client_name_of_shop,
            client_owner_name, client_village_name, client_phone_number1,
            client_phone_number2, client_dob, client_marital_status,
            client_marriage_anniversary, client_address, client_near_by,
            client_pin, client_medical_detail, client_mineral_for_water,
            client_vit_mineral_for_feed, client_vitamin_c, client_oxygen_suppliment,
            client_probiotic_soil_water, client_probiotic_feed, client_name_of_farmer,
            client_area_of_culture, client_no_of_pond, client_agent_checkbox, client_sub_agent_checkbox,
            client_retailer_checkbox, client_agent_name, client_sub_agent_name,
            client_retailer_name, client_route_id, client_sub_route_name,
            field_technician_id, hq_id, clientId
        ];

        const [updateResult] = await conn.execute(updateQuery, values);

        if (updateResult.affectedRows === 0) {
            return { success: false, message: "No changes were made. Update failed." };
        }

        return { success: true, message: "Client details updated successfully!" };

    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
}



module.exports = { fieldTechnicianDistributionFetchService,fieldTechnicianClientDetailsInsertService,fetchFieldTechnicianClientTypesService,fetchFieldTechnicianClientDetailsByRouteService,fieldTechnicianClientDetailsUpdateService };
