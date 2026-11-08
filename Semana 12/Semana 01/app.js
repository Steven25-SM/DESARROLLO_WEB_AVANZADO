const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const tareas = [];

const tareasPorCategoria = {
    Estudio: [],
    Trabajo: [],
    Personal: []
};

let siguienteId = 1;

function preguntar(pregunta) {
    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
            resolve(respuesta.trim());
        });
    });
}

async function agregarTarea() {
    console.log("\n--- AGREGAR TAREA ---");

    const titulo = await preguntar("Título: ");
    const descripcion = await preguntar("Descripción: ");

    console.log("\nCategorías disponibles:");
    console.log("1. Estudio");
    console.log("2. Trabajo");
    console.log("3. Personal");

    const opcionCategoria = await preguntar("Seleccione una categoría: ");

    let categoria;

    switch (opcionCategoria) {
        case "1":
            categoria = "Estudio";
            break;

        case "2":
            categoria = "Trabajo";
            break;

        case "3":
            categoria = "Personal";
            break;

        default:
            console.log("Categoría inválida.");
            return;
    }

    const tarea = {
        id: siguienteId,
        titulo: titulo,
        descripcion: descripcion,
        categoria: categoria,
        estado: "Pendiente"
    };

    // Agregamos la tarea al Array principal
    tareas.push(tarea);

    // Agregamos la tarea al diccionario correspondiente
    tareasPorCategoria[categoria].push(tarea);

    siguienteId++;

    console.log("\n✅ Tarea agregada correctamente.");
}

function listarTareas() {
    console.log("\n--- TODAS LAS TAREAS ---");

    if (tareas.length === 0) {
        console.log("No existen tareas registradas.");
        return;
    }

    tareas.forEach((tarea) => {
        console.log("\n-------------------------");
        console.log(`ID: ${tarea.id}`);
        console.log(`Título: ${tarea.titulo}`);
        console.log(`Descripción: ${tarea.descripcion}`);
        console.log(`Categoría: ${tarea.categoria}`);
        console.log(`Estado: ${tarea.estado}`);
    });
}

function listarPendientes() {
    console.log("\n--- TAREAS PENDIENTES ---");

    const pendientes = tareas.filter(
        (tarea) => tarea.estado === "Pendiente"
    );

    if (pendientes.length === 0) {
        console.log("No existen tareas pendientes.");
        return;
    }

    pendientes.forEach((tarea) => {
        console.log(
            `[${tarea.id}] ${tarea.titulo} - ${tarea.categoria}`
        );
    });
}

function listarCompletadas() {
    console.log("\n--- TAREAS COMPLETADAS ---");

    const completadas = tareas.filter(
        (tarea) => tarea.estado === "Completada"
    );

    if (completadas.length === 0) {
        console.log("No existen tareas completadas.");
        return;
    }

    completadas.forEach((tarea) => {
        console.log(
            `[${tarea.id}] ${tarea.titulo} - ${tarea.categoria}`
        );
    });
}

async function completarTarea() {
    console.log("\n--- COMPLETAR TAREA ---");

    if (tareas.length === 0) {
        console.log("No existen tareas.");
        return;
    }

    const id = Number(await preguntar("Ingrese el ID de la tarea: "));

    const tarea = tareas.find((tarea) => tarea.id === id);

    if (!tarea) {
        console.log("❌ No se encontró una tarea con ese ID.");
        return;
    }

    if (tarea.estado === "Completada") {
        console.log("La tarea ya está completada.");
        return;
    }

    tarea.estado = "Completada";

    console.log("✅ Tarea marcada como completada.");
}

async function listarPorCategoria() {
    console.log("\n--- TAREAS POR CATEGORÍA ---");

    console.log("1. Estudio");
    console.log("2. Trabajo");
    console.log("3. Personal");

    const opcion = await preguntar("Seleccione una categoría: ");

    let categoria;

    switch (opcion) {
        case "1":
            categoria = "Estudio";
            break;

        case "2":
            categoria = "Trabajo";
            break;

        case "3":
            categoria = "Personal";
            break;

        default:
            console.log("Categoría inválida.");
            return;
    }

    const tareasCategoria = tareasPorCategoria[categoria];

    console.log(`\n--- CATEGORÍA: ${categoria} ---`);

    if (tareasCategoria.length === 0) {
        console.log("No existen tareas en esta categoría.");
        return;
    }

    tareasCategoria.forEach((tarea) => {
        console.log(
            `[${tarea.id}] ${tarea.titulo} - ${tarea.estado}`
        );
    });
}

async function mostrarMenu() {
    let continuar = true;

    while (continuar) {
        console.log("\n=================================");
        console.log("       GESTOR DE TAREAS");
        console.log("=================================");
        console.log("1. Agregar tarea");
        console.log("2. Listar todas las tareas");
        console.log("3. Listar tareas pendientes");
        console.log("4. Listar tareas completadas");
        console.log("5. Marcar tarea como completada");
        console.log("6. Listar tareas por categoría");
        console.log("7. Salir");
        console.log("=================================");

        const opcion = await preguntar("Seleccione una opción: ");

        switch (opcion) {
            case "1":
                await agregarTarea();
                break;

            case "2":
                listarTareas();
                break;

            case "3":
                listarPendientes();
                break;

            case "4":
                listarCompletadas();
                break;

            case "5":
                await completarTarea();
                break;

            case "6":
                await listarPorCategoria();
                break;

            case "7":
                continuar = false;
                console.log("\nPrograma finalizado.");
                break;

            default:
                console.log("\n❌ Opción inválida.");
        }
    }

    rl.close();
}

mostrarMenu();