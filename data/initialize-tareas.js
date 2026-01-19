module.exports = (db) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS tareas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            titulo TEXT NOT NULL,
            descripcion TEXT,
            completada INTEGER DEFAULT 0,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.prepare(sql).run();

    // Inserta una tarea de ejemplo si la tabla está vacía
    const count = db.prepare('SELECT count(*) as total FROM tareas').get();
    if (count.total === 0) {
        db.prepare('INSERT INTO tareas (id_usuario, titulo, descripcion, completada) VALUES (?, ?, ?, ?)')
            .run(1, 'Mi primera tarea', 'Descripción de ejemplo', 0);
    }

}