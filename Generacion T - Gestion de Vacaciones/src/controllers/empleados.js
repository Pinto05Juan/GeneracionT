import db from '../database.js';

export default {get, getById, post, postVacation, getVacationsByEmployeeId, patchVacation};

async function get(req, res) {
    if (!["Comercial", "RRHH", "Tecnica"].includes(req.employee.area)) 
        return res.status(403).send();
    let query = `SELECT 
                    Empleado.FK_dniEmpleado, 
                    Empleado.area, 
                    Empleado.fechaIngreso, 
                    Empleado.FK_proyectoAsignado, 
                    Empleado.FK_usuarioAsociado, 
                    Persona.nombre, 
                    Persona.apellido, 
                    Persona.telefono, 
                    Persona.direccion, 
                    Persona.email, 
                    Persona.fechaNacimiento 
                FROM 
                    Empleado INNER JOIN Persona 
                    ON Empleado.FK_dniEmpleado LIKE Persona.PK_dni`;
    if (req.query.onProject !== undefined) 
        query = query.concat(` AND Empleado.FK_proyectoAsignado IS ${req.query.onProject.toLowerCase() === "true" ? 'NOT NULL' : 'NULL'} AND Empleado.FK_propuestaAsignada IS ${req.query.onProject.toLowerCase() === "true" ? 'NOT NULL' : 'NULL'}`);
    
    const [employees] = await db.execute(query.concat(';'))
        .catch(error => res.status(500).send(error), [null]);

    if (employees) 
        return res.status(200).json(employees);
}

async function getById(req, res) {
    if (req.employee.area === "Desarrollo" && req.employee.FK_dniEmpleado !== req.params.employeeId) 
        return res.status(403).send();
    let query = `SELECT 
                    Empleado.FK_dniEmpleado, 
                    Empleado.area, 
                    Empleado.fechaIngreso, 
                    Empleado.FK_proyectoAsignado, 
                    Empleado.FK_usuarioAsociado, 
                    Persona.nombre, 
                    Persona.apellido, 
                    Persona.telefono, 
                    Persona.direccion, 
                    Persona.email, 
                    Persona.fechaNacimiento 
                FROM 
                    Empleado INNER JOIN Persona 
                ON 
                    Empleado.FK_dniEmpleado LIKE Persona.PK_dni
                WHERE
                    Empleado.FK_dniEmpleado LIKE ?`;
    
    const [employees] = await db.execute(query, [req.params.employeeId])
        .catch(error => res.status(500).send(error), [null]);

    if (employees === null) 
        return;

    if (employees.length === 0)
        return res.status(404).send();

    return res.status(200).json(employees[0]);
}


async function post(req, res) {
    if (req.employee.area !== "RRHH") 
        return res.status(403).send();
    
    const {person, department, username, password} = req.body;
    const dateHired = req.body.dateHired?.slice(0, -1);
    if (person === undefined || !(person instanceof Object)) 
        return res.status(400).send("missing or invalid field person");
    const {dni, name, surname, phone, address, email} = person;
    const birthdate = person.birthdate?.slice(0, -1);
    const personData = {dni, name, surname, phone, address, email, birthdate};
    const employeeData = {personId: dni, department, dateHired, username};
    const fields = {...personData, ...employeeData};
    for (const key in fields) 
        if (fields[key] === undefined) 
            return res.status(400).send(`missing field ${key}`);
    await db.beginTransaction();
    try {
        await db.execute("INSERT INTO Persona VALUES (?, ?, ?, ?, ?, ?, ?);", Object.values(personData));
        await db.execute("INSERT INTO Usuario VALUES (?, ?);", [username, password]);
        await db.execute("INSERT INTO Empleado(FK_dniEmpleado, area, fechaIngreso, FK_usuarioAsociado) VALUES (?, ?, ?, ?);", Object.values(employeeData));
    } catch (error) {
        console.log(error);
        await db.rollback();
        return res.status(500).send(error);
    }
    await db.commit();
    return res.status(204).send();
}

async function postVacation(req, res) {
    req.body.state ??= "En observacion";
    const from = req.body.from?.slice(0, -1);
    const to = req.body.to?.slice(0, -1);
    const {state} = req.body;
    if (req.employee.FK_dniEmpleado !== req.params.employeeId)
        return res.status(403).send();

    if (to === undefined) 
        return res.status(400).send(`missing field to`);
    //TODO fix
    try {
        await db.execute(`INSERT INTO PeticionVacacion(FK_empleado, estado, fechaInicio, fechaFin) VALUES (?, ?, ?, ?)`, [req.params.employeeId, state, from, to]);
    } catch (error) {  
        console.log(error);
        return res.status(500).send(error);
    }

    return res.status(204).send();
}

async function getVacationsByEmployeeId(req, res) {
    if (req.employee.area !== "RRHH" && req.employee.FK_dniEmpleado !== req.params.employeeId) 
        return res.status(403).send();
    
    const [vacations] = await db.execute("SELECT * FROM PeticionVacacion WHERE PeticionVacacion.FK_empleado LIKE ?", [req.params.employeeId])
        .catch(error => res.status(500).send(error), [null]);

    if (vacations) 
        return res.status(200).json(vacations);
}

async function patchVacation(req, res) {
    if (req.employee.area !== "RRHH") 
        return res.status(403).send();
    
    const {state} = req.body;
    
    let query = "UPDATE PeticionVacacion SET";
    
    const data = [];
    if (state !== undefined) {
        query = query.concat(`${data.length!==0 ? ",":""} estado = ?`);
        data.push(state);
    }
    if (data.length === 0) // NO OP
        return res.status(204).send();

    await db.beginTransaction();
    try {
        query = query.concat(" WHERE PeticionVacacion.PK_idPeticion = ?");
        data.push(req.params.vacationId);
        await db.execute(query, data);
    } catch (error) {
        await db.rollback();
        return res.status(500).send(error);
    }
    await db.commit();
    return res.status(200).send();
}