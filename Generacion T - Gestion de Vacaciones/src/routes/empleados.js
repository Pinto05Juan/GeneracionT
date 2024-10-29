import { Router } from "express";
import empleados from "../controllers/empleados.js";
const router = Router();

/**
 * Query:
 *      onProject?: boolean
 *          if present it filters employees based on their assigned project
 * 
 * Response:
 *      200 OK: employees array on body
 *      403 Forbidden: when employee doesnt belong to either commerce nor HR nor technical
 *      500 Internal Server Error: on mysql error
 */
router.get("/", empleados.get);

router.get("/:employeeId", empleados.getById);

/**
 * Request Body:
 *      {
 *          person: {
 *              dni: string,
 *              name: string,
 *              surname: string,
 *              phone: string,
 *              address: string,
 *              email: string,
 *              birthdate: Date
 *          },
 *          department: Enum("Desarrollo", "Tecnica", "Comercial", "RRHH"),
 *          dateHired: Date,
 *          username: string,
 *          password: string
 *      }
 *      
 * Response:
 *      400 Bad Request: when the body is missing a required field
 *      403 Forbidden: when employee doesnt belong to HR department
 *      500 Internal Server Error: on mysql error
 *      204 No Content: on successful insert
 */
router.post("/", empleados.post);

/**
 * Response:
 *      403 Forbidden: when employee doesnt belong to HR department
 *      500 Internal Server Error: on mysql error
 *      200 OK: vacations array on body
 */
router.get("/:employeeId/vacaciones", empleados.getVacationsByEmployeeId);

/**
 * Request body:
 *      {
 *          from: Date
 *          to: Date,
 *          state?: ENUM(default= "En observacion", "Aprobado", "Rechazado")    
 *      }
 *       
 * Response:
 *      400 Bad Request: when the body is missing a required field
 *      500 Internal Server Error: on mysql error
 *      403 Forbidden: when the employee making the request is not the same as the one in the vacation
 *      204 No Content: insert succeeded
 */
router.post("/:employeeId/vacaciones", empleados.postVacation);

/**
 * Request
 *      {
 *          requestedDays?: int,
 *          state?: ENUM(default= "En observacion", "Aprobado", "Rechazado")    
 *      }
 * Response:
 *      500 Internal Server Error: on mysql error
 *      403 Forbidden: when the employee doesnt belong to HR department
 *      204 No Content: update succeeded
 */
router.patch("/:employeeId/vacaciones/:vacationId", empleados.patchVacation);

export default router;