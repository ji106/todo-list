// Definición de la clase TareaDAO para manejar operaciones relacionadas con la tabla 'tareas'

class TareaDAO {
    #database = null; // Variable estática para almacenar la instancia de la base de datos

    // El constructor recibe la instancia de la base de datos y la almacena en la clase
    constructor(database) {
        this.#database = database;
    }

    // Método para buscar un usuario por su email
    findTareasByUserId(id) {
        // Prepara y ejecuta una consulta SQL para buscar el usuario por email
        const sql = `SELECT * FROM tareas WHERE id_usuario=?`;
        return this.#database.prepare(sql).all(id);
    }

    // Método para guardar una nueva tarea
    // Recibe como parámetros la info de la nueva tarea: id_usuario, titulo, descripcion, completada
    saveTarea(id_usuario, titulo, descripcion, completada = 0, fecha_creacion) {
        fecha_creacion = new Date()
        const sql = `INSERT INTO tareas (id_usuario, titulo, descripcion, completada) VALUES (?, ?, ?, ?)`;
        return this.#database.prepare(sql).run(id_usuario, titulo, descripcion, completada);
    }

    // Método para eliminar una tarea por su id
    deleteTarea(id) {
        const sql = `DELETE FROM tareas WHERE id = ?`;
        return this.#database.prepare(sql).run(id);
    }

    // Método para marcar una tarea como completada (columna completada a 1)
    finishTarea(id) {
        const sql = `UPDATE tareas SET completada = 1 WHERE id = ?`;
        return this.#database.prepare(sql).run(id);
    }

}

// Exporta la clase UsuarioDAO para que pueda ser utilizada en otros módulos
module.exports = TareaDAO;